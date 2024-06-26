import { ReactElement, useState } from 'react'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Login from './Login'
import SignUp from './SignUp'
import { userService } from '../../services/user.service'
import Button from '../common/Button'
import ForgotPassword from './ForgotPassword'
import { IUser } from '../../model'
import socketService from '../../services/socket.service'
import { SocketEmitEvents } from '../../utils/socketEvents'
import { AuthState } from '../../context/useAuth'

interface FormModes {
      login: ReactElement;
      signUp: ReactElement;
      reset: ReactElement;
}

interface FormData {
      username?: string
      email: string
      password?: string
      confirmPassword?: string
      profileImg?: string
}

export default function Form(): JSX.Element {
      const { setUser, setJustLoggedIn } = AuthState()
      const [formMode, setFormMode] = useState<keyof FormModes>('login')
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [image, setImage] = useState<File | string>('')
      const navigate = useNavigate()

      const validationSchema = (() => {
            switch (formMode) {
                  case 'login':
                        return Yup.object().shape({
                              email: Yup.string().required('Email is required').email('Email is invalid'),
                              password: Yup.string()
                                    .required('Password is required')
                                    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Password must contain at least one letter, one number, and be at least 6 characters long')
                                    .min(6, 'Password must be at least 6 characters')
                                    .max(20, 'Password must not exceed 20 characters'),
                        })
                  case 'signUp':
                        return Yup.object().shape({
                              username: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters').max(20, 'Name must not exceed 20 characters'),
                              email: Yup.string().required('Email is required').email('Email is invalid'),
                              password: Yup.string()
                                    .required('Password is required')
                                    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain at least one letter, one number, and be at least 8 characters long')
                                    .min(6, 'Password must be at least 6 characters')
                                    .max(20, 'Password must not exceed 20 characters'),
                              confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
                        })
                  case 'reset':
                        return Yup.object().shape({
                              email: Yup.string().required('Email is required').email('Email is invalid'),
                        })
                  default:
                        return undefined
            }
      })()

      const formik = useFormik({
            initialValues: {
                  username: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
            },
            validationSchema: validationSchema,
            onSubmit: handleSubmit,
      })

      function setGuestUser(): void {
            formik.setValues({ email: 'example@example.com', password: 'demo1234' })
      }


      function setOferUser() {
            formik.setValues({ email: 'ofergavri@gmail.com', password: 'ofer1234' })
      }

      async function handleResetPassword(values: FormData) {
            try {
                  await userService.sendResetPasswordMail(values.email)
                  toast.success('Password reset link sent to your email')
            } catch (error) {
                  if (axios.isAxiosError(error)) toast.warn(error?.response?.data.msg || "An error occurred")
                  console.log(error)
            }
      }

      async function handleSubmit(values: FormData) {
            let modifiedValues
            setIsLoading(true)

            if (formMode === 'login') {
                  modifiedValues = { email: values.email, password: values.password }

            } else if (formMode === 'signUp') {
                  modifiedValues = { username: values.username, email: values.email, password: values.password, confirmPassword: values.confirmPassword, profileImg: image }

            } else if (formMode === 'reset') {
                  modifiedValues = { email: values.email }
                  await handleResetPassword(modifiedValues)
                  setIsLoading(false)
                  return
            }

            try {
                  const user = await userService.loginSignUp(modifiedValues, formMode) as IUser
                  setUser(user)
                  socketService.emit(SocketEmitEvents.LOGIN, user._id)
                  setJustLoggedIn(true)
                  navigate('/chat')

            } catch (error) {
                  console.log(error)
                  if (typeof error === 'string') {
                        toast.error(error)
                  }
            } finally {
                  setIsLoading(false)
            }
      }

      function onFormModeChange(mode: 'login' | 'signUp' | 'reset') {
            setFormMode(mode)
            formik.resetForm()
      }

      return (
            <FormikProvider value={formik}>
                  <section className='text-sm lg:text-base'>

                        <div className="flex gap-x-2">
                              <Button
                                    className={`auth-btn disabled:cursor-not-allowed ${formMode === 'login' ? 'border-b-2 border-b-primary' : 'border-b-2 border-white'}`}
                                    onClick={() => onFormModeChange('login')}
                                    type='button'
                                    disabled={isLoading}>
                                    Login
                              </Button>
                              <Button
                                    className={`auth-btn disabled:cursor-not-allowed ${formMode === 'signUp' ? 'border-b-2 border-b-primary' : 'border-b-2 border-white'}`}
                                    onClick={() => onFormModeChange('signUp')}
                                    type='button'
                                    disabled={isLoading}>
                                    Sign Up
                              </Button>
                        </div>

                        <form className="flex flex-col mt-6" onSubmit={formik.handleSubmit} id='auth-form'>
                              {formMode === 'login' && <Login formik={formik} isLoading={isLoading} />}
                              {formMode === 'signUp' && <SignUp formik={formik} image={image} setImage={setImage} isLoading={isLoading} />}
                              {formMode === 'reset' && <ForgotPassword formik={formik} />}

                              {formMode === 'login' && (
                                    <button
                                          type="button"
                                          className='underline underline-offset-2 text-end text-sm transition-all mt-2 duration-100 hover:text-primary disabled:cursor-not-allowed'
                                          onClick={() => setFormMode('reset')}
                                          disabled={isLoading}>
                                          Forget you'r password ?</button>
                              )}
                              <div className='flex flex-col gap-[2px] mt-4'>
                                    <Button
                                          className="bg-primary transition-colors text-white duration-300 max-h-[40px] rounded-md p-2 my-2 disabled:cursor-not-allowed hover:bg-primary/90"
                                          type="submit"
                                          disabled={!formik.dirty || isLoading}
                                          isLoading={isLoading}>
                                          {formMode === 'reset' ? 'Send Email' : formMode.charAt(0).toUpperCase() + formMode.slice(1)} &rarr;
                                    </Button>
                                    {formMode === 'login' && (
                                          <>
                                                <Button
                                                      className="bg-primary/70 text-white rounded-md p-2 transition-colors duration-300 hover:bg-primary/80 disabled:cursor-not-allowed"
                                                      type="button"
                                                      onClick={setGuestUser}
                                                      disabled={isLoading}>
                                                      Get Guest User Credentials
                                                </Button>

                                                {process.env.NODE_ENV === 'development' && (
                                                      <Button
                                                            className="bg-primary/70 text-white rounded-md p-2 transition-colors duration-300 hover:bg-primary/80 disabled:cursor-not-allowed"
                                                            type="button"
                                                            onClick={setOferUser}
                                                            disabled={isLoading}>
                                                            Get OFER User Credentials
                                                      </Button>
                                                )}
                                          </>
                                    )}
                              </div>
                        </form>
                  </section>
            </FormikProvider>
      )
}

import { FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AuthState } from '../../context/useAuth'
import { userService } from '../../services/user.service'
import { useNavigate } from 'react-router-dom'

interface FormData {
      username?: string
      email: string
      password: string
      confirmPassword?: string
      profileImg?: string
}

export default function Form (): JSX.Element {
      const [isLogin, setIsLogin] = useState<boolean>(true)
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [image, setImage] = useState<string>('')
      const { setUser } = AuthState()
      const navigate = useNavigate()

      const validationSchema = isLogin
            ? Yup.object().shape({
                  email: Yup.string().required('Email is required').email('Email is invalid'),
                  password: Yup.string()
                        .required('Password is required')
                        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain at least one letter, one number, and be at least 8 characters long')
                        .min(6, 'Password must be at least 6 characters')
                        .max(20, 'Password must not exceed 20 characters'),
            })
            : Yup.object().shape({
                  username: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters').max(20, 'Name must not exceed 20 characters'),
                  email: Yup.string().required('Email is required').email('Email is invalid'),
                  password: Yup.string()
                        .required('Password is required')
                        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain at least one letter, one number, and be at least 8 characters long')
                        .min(6, 'Password must be at least 6 characters')
                        .max(20, 'Password must not exceed 20 characters'),
                  confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
            })

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

      function toggleForm (isLogin: boolean) {
            formik.resetForm({ values: formik.initialValues })
            setIsLogin(isLogin)
      }

      function setGuestUser () {
            setIsLogin(true)
            formik.setValues({ email: 'example@example.com', password: 'demo1234' })
      }

      async function handleSubmit (values: FormData) {
            values = isLogin ?
                  { email: values.email, password: values.password } :
                  { username: values.username, email: values.email, password: values.password, profileImg: image }

            setIsLoading(true)
            try {
                  const user = await userService.loginSignUp(values, isLogin)
                  setUser(user)
                  navigate('/chat')
            } catch (error) {
                  if (axios.isAxiosError(error)) toast.error(error?.response?.data.msg)
                  console.log(error)
            } finally {
                  setIsLoading(false)
            }
      }

      return (
            <FormikProvider value={formik}>
                  <div className="flex justify-between gap-x-2">
                        <button className={`login-btn ${isLogin ? 'bg-primary text-white' : 'hover:bg-[#96d5ff] hover:text-white'}`} onClick={() => toggleForm(true)}>Login</button>
                        <button className={`login-btn ${!isLogin ? 'bg-primary text-white' : 'hover:bg-[#96d5ff] hover:text-white'}`} onClick={() => toggleForm(false)}>Sign Up</button>
                  </div>

                  <form className="flex flex-col gap-y-4 my-4" onSubmit={formik.handleSubmit}>
                        {isLogin ? (
                              <Login formik={formik} />) : (
                              <SignUp formik={formik} image={image} setImage={setImage} />
                        )}
                        <button disabled={!formik.dirty || isLoading} className="bg-primary transition-colors text-white duration-300 max-h-[40px] rounded-md p-2 my-2 disabled:cursor-not-allowed hover:bg-[#23a7ff]" type="submit">
                              {isLoading ? <div className='spinner ' /> : 'Submit'}
                        </button>
                        <button className="bg-[#55bbff] text-white rounded-md p-2 transition-colors duration-300 hover:bg-[#23a7ff]" type="button" onClick={setGuestUser}>Get Guest User Credentials</button>
                  </form>
            </FormikProvider>
      )
}

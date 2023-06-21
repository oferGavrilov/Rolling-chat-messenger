import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Field, ErrorMessage, useFormik, FormikProvider } from 'formik'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/user.service'
import { uploadImg } from '../utils/upload-img'
import axios from 'axios'
import { AuthState } from '../context/useAuth'


interface FormData {
      username?: string
      email: string
      password: string
      confirmPassword?: string
      profileImg?: string
}

export default function Auth () {
      const [isLogin, setIsLogin] = useState<boolean>(true)
      const [isLoading, setIsLoadig] = useState<boolean>(false)
      const [image, setImage] = useState<string>('')
      const navigate = useNavigate()

      const { setUser } = AuthState()

      useEffect(() => {
            const user = userService.getLoggedinUser()
            if (user) navigate('/chat')
      }, [navigate])

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

      async function handleSubmit (values: FormData) {
            values = isLogin ? { email: values.email, password: values.password } : { username: values.username, email: values.email, password: values.password, profileImg: image }
            setIsLoadig(true)
            try {
                  const user = await userService.loginSignUp(values, isLogin)
                  setUser(user)
                  toast.success(`Welcome ${user.username}`)
                  navigate('/chat')
            } catch (error) {
                  if (axios.isAxiosError(error)) toast.error(error?.response?.data.msg)
                  console.log(error)
            } finally {
                  setIsLoadig(false)
            }
      }

      async function uploadImage (file: File) {
            if (!file) return toast.error('Upload image went wrong')
            try {
                  setIsLoadig(true)
                  const data = await uploadImg(file)
                  setImage(data.url)
            } catch (err) {
                  console.log(err)
            } finally {
                  setIsLoadig(false)
            }
      }

      function setGuestUser () {
            formik.setValues({ email: 'example@example.com', password: 'demo1234' })
      }

      return (
            <section className=" max-w-lg pt-16 mx-auto fade-down" >
                  <div className="bg-white rounded-lg p-6 shadow-lg">

                        <>
                              <FormikProvider value={formik}>
                                    <div className="flex justify-between gap-x-2">
                                          <button className={`login-btn ${isLogin ? 'bg-[#84a98c] text-white' : 'hover:bg-[#84a98c90]'}`} onClick={() => toggleForm(true)}>Login</button>
                                          <button className={`login-btn ${!isLogin ? 'bg-[#84a98c]' : 'hover:bg-[#84a98c90]'}`} onClick={() => toggleForm(false)}>Sign Up</button>
                                    </div>

                                    <form className="flex flex-col gap-y-2 mt-4" onSubmit={formik.handleSubmit}>
                                          {isLogin ? (
                                                <>
                                                      <label htmlFor="email">Email Address</label>
                                                      <Field type="email" name="email" onChange={formik.handleChange} value={formik.values.email} id="email" className={`login-input ${formik.errors.email && formik.touched.email ? 'input-error' : ''}`} />
                                                      <ErrorMessage name="email" component="div" className="error-message" />

                                                      <label htmlFor="password">Password</label>
                                                      <Field type="password" name="password" id="password" onChange={formik.handleChange} value={formik.values.password} className={`login-input ${formik.errors.password && formik.touched.password ? 'input-error' : ''}`} />
                                                      <ErrorMessage name="password" component="div" className="error-message" />
                                                </>
                                          ) : (
                                                <>

                                                      <label htmlFor="email">Email Address</label>
                                                      <Field type="email" name="email" onChange={formik.handleChange} id="email" value={formik.values.email} className={`login-input ${formik.errors.email && formik.touched.email ? 'input-error' : ''}`} />
                                                      <ErrorMessage name="email" component="div" className="error-message" />

                                                      <label htmlFor="name">Username</label>
                                                      <Field type="text" name="username" onChange={formik.handleChange} id="username" value={formik.values.username} className={`login-input ${formik.errors.username && formik.touched.username ? 'input-error' : ''}`} />
                                                      <ErrorMessage name="username" component="div" className="error-message" />

                                                      <label htmlFor="password">Password</label>
                                                      <Field type="password" name="password" onChange={formik.handleChange} id="password" value={formik.values.password} className={`login-input ${formik.errors.password && formik.touched.password ? 'input-error' : ''}`} />
                                                      <ErrorMessage name="password" component="div" className="error-message" />

                                                      <label htmlFor="confirmPassword">Confirm Password</label>
                                                      <Field type="password" name="confirmPassword" onChange={formik.handleChange} id="confirmPassword" value={formik.values.confirmPassword} className={`login-input ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'input-error' : ''}`} />
                                                      <ErrorMessage name="confirmPassword" component="div" className="error-message" />

                                                      <label htmlFor="img-upload">Profile Image</label>
                                                      <Field type="file"
                                                            name="image"
                                                            id="image"
                                                            className='login-input'
                                                            accept="image/*"
                                                            onChange={(e: { target: { files: File[] } }) => uploadImage(e.target.files[0])}
                                                      />

                                                      <ErrorMessage name="image" component="div" className="error-message" />
                                                </>
                                          )}
                                          <button disabled={!formik.dirty || isLoading} className="bg-[#84a98c] transition-colors text-white duration-200 max-h-[40px] rounded-md p-2 my-2 disabled:cursor-not-allowed hover:bg-[#638169]" type="submit">{isLoading ? <div className='spinner'></div> : 'Submit'}</button>
                                          <button className="bg-[#cad2c5] rounded-md p-2 text-gray-500 transition-colors duration-200 hover:bg-[#bbc8b3]" type="button" onClick={setGuestUser}>Get Guest User Credentials</button>
                                    </form>
                              </FormikProvider>
                        </>
                  </div>
            </section >
      )
}

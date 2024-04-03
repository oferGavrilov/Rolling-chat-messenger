import React, { useState } from 'react'
import { ErrorMessage, Field, FormikProps } from 'formik'
import UploadImage from '../UploadImage'
import { FaEye } from 'react-icons/fa'
import { RiEyeCloseLine } from 'react-icons/ri'

interface SignUpProps {
      formik: FormikProps<SignupData>
      image: File | string
      setImage: React.Dispatch<React.SetStateAction<File | string>>
      isLoading: boolean
}

interface SignupData {
      email: string
      password?: string
      username?: string
      confirmPassword?: string
      profileImg?: string
}

export default function SignUp({ formik, image, setImage, isLoading }: SignUpProps) {
      const [showPassword, setShowPassword] = useState<boolean>(false)

      async function handleImageChange(image: File) {
            setImage(image)
      }

      return (
            <>
                  <div className='input-group'>
                        <Field
                              type="email"
                              name="email"
                              id="email"
                              disabled={isLoading}
                              autoComplete="email"
                              onChange={formik.handleChange}
                              value={formik.values.email}
                              className={`auth-input ${formik.errors.email && formik.touched.email ? 'input-error' : ''}`}
                        />
                        <label htmlFor="email">Email</label>
                  </div>
                  <ErrorMessage name="email" component="div" className="error-message" />

                  <div className='input-group mt-4'>
                        <Field
                              type="text"
                              name="username"
                              id="username"
                              autoComplete="username"
                              disabled={isLoading}
                              onChange={formik.handleChange}
                              value={formik.values.username}
                              className={`auth-input ${formik.errors.username && formik.touched.username ? 'input-error' : ''}`}
                        />
                        <label htmlFor="username">Username</label>
                  </div>
                  <ErrorMessage name="username" component="div" className="error-message" />

                  <div className='w-full relative'>
                        <div className='input-group mt-4'>
                              <Field
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    className={`auth-input ${formik.errors.password && formik.touched.password ? 'input-error' : ''}`}
                              />
                              <label htmlFor="password">Password</label>
                        </div>

                        <div className='absolute top-1/2 h-max right-3 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ?
                                    <FaEye className='toggle-password-btn' /> :
                                    <RiEyeCloseLine className='toggle-password-btn' />
                              }
                        </div>
                  </div>
                  <ErrorMessage name="password" component="div" className="error-message" />

                  <div className='input-group mt-4'>
                        <Field
                              type={showPassword ? "text" : "password"}
                              name="confirmPassword"
                              id="confirmPassword"
                              autoComplete="new-password"
                              disabled={isLoading}
                              onChange={formik.handleChange}
                              value={formik.values.confirmPassword}
                              className={`auth-input ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'input-error' : ''}`}
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />

                  <div className={`mt-4 ${isLoading ? 'pointer-events-none' : ''}`}>
                        <UploadImage image={image} handleImageChange={handleImageChange} />
                  </div>

                  <ErrorMessage name="image" component="div" className="error-message" />
            </>
      )
}

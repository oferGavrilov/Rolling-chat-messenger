import React, { useState } from 'react'
import { ErrorMessage, Field, FormikProps } from 'formik'
import UploadImage from '../UploadImage'
import { FaEye } from 'react-icons/fa'
import { RiEyeCloseLine } from 'react-icons/ri'

interface SignUpProps {
      formik: FormikProps<SignupData>
      image: string
      setImage: React.Dispatch<React.SetStateAction<string>>
}

interface SignupData {
      email: string
      password?: string
      username?: string
      confirmPassword?: string
      profileImg?: string
}
export default function SignUp({ formik, image, setImage }: SignUpProps) {
      const [showPassword, setShowPassword] = useState<boolean>(false)

      return (
            <>
                  <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className={`auth-input ${formik.errors.email && formik.touched.email ? 'input-error' : ''}`}
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />

                  <Field
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        className={`auth-input ${formik.errors.username && formik.touched.username ? 'input-error' : ''}`}
                  />
                  <ErrorMessage name="username" component="div" className="error-message" />

                  <div className='w-full relative'>

                        <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              id="password"
                              placeholder="Password"
                              onChange={formik.handleChange}
                              value={formik.values.password}
                              className={`auth-input w-full ${formik.errors.password && formik.touched.password ? 'input-error' : ''}`}
                        />

                        <div className='absolute top-0 h-full right-3 cursor-pointer flex items-center justify-center' onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ?
                                   <FaEye className='toggle-password-btn' /> : 
                                   <RiEyeCloseLine className='toggle-password-btn' />
                              }
                        </div>
                  </div>
                  <ErrorMessage name="password" component="div" className="error-message" />
                  <Field
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                        className={`auth-input ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'input-error' : ''}`}
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />

                  <UploadImage image={image} setImage={setImage} />

                  <ErrorMessage name="image" component="div" className="error-message" />
            </>
      )
}

import { Field, ErrorMessage, FormikProps } from 'formik'
import { useState } from 'react'
import { FaEye } from "react-icons/fa"
import { RiEyeCloseLine } from "react-icons/ri"

interface LoginProps {
      formik: FormikProps<LoginData>
      isLoading: boolean
}

type LoginData = {
      email: string
      password?: string
}

export default function Login({ formik, isLoading }: LoginProps) {
      const [showPassword, setShowPassword] = useState<boolean>(false)

      return (
            <>
                  <div className='input-group'>
                        <Field
                              type="email"
                              name="email"
                              id="email"
                              autoComplete="email"
                              disabled={isLoading}
                              maximum-scale={1}
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              maxLength={60}
                              className={`auth-input ${formik.errors.email && formik.touched.email ? 'input-error' : ''}`}
                        />
                        <label htmlFor="email">Email</label>
                  </div>
                  <ErrorMessage name="email" component="div" className="error-message" />

                  <div className='w-full relative'>
                        <div className='input-group mt-4'>
                              <Field
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    maxLength={20}
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
            </>
      )
}

import { Field, ErrorMessage, FormikProps } from 'formik'
import { useState } from 'react'
import { FaEye } from "react-icons/fa"
import { RiEyeCloseLine } from "react-icons/ri"

interface LoginProps {
      formik: FormikProps<LoginData>
}

type LoginData = {
      email: string
      password?: string
}

export default function Login({ formik}: LoginProps) {
      const [showPassword, setShowPassword] = useState<boolean>(false)

      return (
            <>
                  <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        autoComplete="email"
                        maximum-scale={1}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        maxLength={60}
                        className={`auth-input ${formik.errors.email && formik.touched.email ? 'input-error' : ''}`}
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />

                  <div className='w-full relative'>
                        <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              id="password"
                              autoComplete="current-password"
                              placeholder="Password"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              maxLength={20}
                              className={`w-full select-none auth-input mt-4 ${formik.errors.password && formik.touched.password ? 'input-error' : ''}`}
                        />

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

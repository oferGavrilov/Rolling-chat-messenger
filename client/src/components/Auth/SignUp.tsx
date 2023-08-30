import React from 'react'
import { ErrorMessage, Field, FormikProps } from 'formik'
import UploadImage from '../UploadImage'

interface SignUpProps {
      formik: FormikProps<SignupData>
      image: string
      setImage: React.Dispatch<React.SetStateAction<string>>
}

interface SignupData {
      email: string
      password: string
      username?: string
      confirmPassword?: string
      profileImg?: string
}
export default function SignUp ({ formik, image, setImage }: SignUpProps) {
      return (
            <>
                  <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className={`auth-input ${formik.errors.email && formik.touched.email ? 'input-error' : ''}`}
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />

                  <Field
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        className={`auth-input ${formik.errors.username && formik.touched.username ? 'input-error' : ''}`}
                  />
                  <ErrorMessage name="username" component="div" className="error-message" />

                  <Field
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        className={`auth-input ${formik.errors.password && formik.touched.password ? 'input-error' : ''}`}
                  />
                  <ErrorMessage name="password" component="div" className="error-message" />

                  <Field
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password"
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

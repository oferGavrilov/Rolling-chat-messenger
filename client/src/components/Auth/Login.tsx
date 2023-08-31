import { Field, ErrorMessage, FormikProps } from 'formik'

interface LoginProps {
      formik: FormikProps<LoginData>
}

type LoginData = {
      email: string
      password: string
}

export default function Login ({ formik }: LoginProps) {
      return (
            <>
                  <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        maximum-scale={1}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        className={`auth-input ${formik.errors.email && formik.touched.email ? 'input-error' : ''}`}
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />

                  <Field
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        className={`auth-input ${formik.errors.password && formik.touched.password ? 'input-error' : ''}`}
                  />
                  <ErrorMessage name="password" component="div" className="error-message" />
            </>
      )
}

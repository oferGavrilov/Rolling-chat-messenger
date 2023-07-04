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
                  <label htmlFor="email">Email Address</label>
                  <Field type="email" name="email" onChange={formik.handleChange} value={formik.values.email} id="email" className={`login-input ${formik.errors.email && formik.touched.email ? 'input-error' : ''}`} />
                  <ErrorMessage name="email" component="div" className="error-message" />

                  <label htmlFor="password">Password</label>
                  <Field type="password" name="password" id="password" onChange={formik.handleChange} value={formik.values.password} className={`login-input ${formik.errors.password && formik.touched.password ? 'input-error' : ''}`} />
                  <ErrorMessage name="password" component="div" className="error-message" />
            </>
      )
}

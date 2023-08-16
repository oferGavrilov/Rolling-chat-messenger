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

                  <UploadImage image={image} setImage={setImage} />

                  <ErrorMessage name="image" component="div" className="error-message" />
            </>
      )
}

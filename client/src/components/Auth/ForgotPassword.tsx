import { ErrorMessage, Field, FormikProps } from 'formik'

interface Props {
    formik: FormikProps<ResetData>
}

type ResetData = {
    email: string
}

export default function ForgotPassword({ formik }: Props) {

    return (
        <div>
            <h4 className='text-center font-bold text-primary text-xl mt-2 mb-4 tracking-wide'>Reset Password</h4>
            <Field
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                maximum-scale={1}
                value={formik.values.email}
                onChange={formik.handleChange}
                maxLength={60}
                className={`auth-input w-full ${formik.errors.email && formik.touched.email ? 'input-error' : ''}`}
            />
            <ErrorMessage name="email" component="div" className="error-message" />

            <div className='float-right text-sm'>
                Didn't get the email ? <button type="button" className='underline underline-offset-2' onClick={() => { }}>Resend</button>
            </div>
        </div>
    )
}

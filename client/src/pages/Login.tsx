import React, { useState } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

type FormData = {
      username?: string;
      email: string;
      password: string;
      confirmPassword?: string;
      picture?: File;
};

export default function Login () {
      const [isLogin, setIsLogin] = useState(true)
      const [isLoading, setIsLoadig] = useState(false)

      const validationSchema = Yup.object().shape({
            username: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters').max(20, 'Name must not exceed 20 characters'),
            email: Yup.string().required('Email is required').email('Email is invalid'),
            password: Yup.string().required('Password is required').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain at least one letter, one number, and be at least 8 characters long').min(6, 'Password must be at least 6 characters').max(20, 'Password must not exceed 20 characters'),
            confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
      })

      function toggleForm (isLogin: boolean, resetForm: CallableFunction) {
            resetForm()
            setIsLogin(isLogin)
      }

      function handleSubmit(values: FormData, { setSubmitting }: { setSubmitting: CallableFunction }) {
            console.log(values)
      }

      return (
            <section className=" max-w-lg pt-16 mx-auto fade-down">
                  <div className="bg-white rounded-lg p-6 shadow-lg">

                        <Formik
                              initialValues={{
                                    username: '',
                                    email: '',
                                    password: '',
                                    confirmPassword: '',
                              }}
                              validationSchema={validationSchema}
                              onSubmit={handleSubmit}
                        >
                              {({ errors, touched, resetForm }) => (
                                    <>
                                          <div className="flex justify-between gap-x-2">
                                                <button className={`login-btn ${isLogin ? 'bg-[#84a98c] text-white' : 'hover:bg-[#84a98c90]'}`} onClick={() => toggleForm(true, resetForm)}>Login</button>
                                                <button className={`login-btn ${!isLogin ? 'bg-[#84a98c]' : 'hover:bg-[#84a98c90]'}`} onClick={() => toggleForm(false, resetForm)}>Sign Up</button>
                                          </div>

                                          <Form className="flex flex-col gap-y-2 mt-4">
                                                {isLogin ? (
                                                      <>
                                                            <label htmlFor="email">Email Address</label>
                                                            <Field type="email" autoFocus name="email" id="email" className={`login-input ${errors.email && touched.email ? 'input-error' : ''}`} />
                                                            <ErrorMessage name="email" component="div" className="error-message" />

                                                            <label htmlFor="password">Password</label>
                                                            <Field type="password" name="password" id="password" className={`login-input ${errors.password && touched.password ? 'input-error' : ''}`} />
                                                            <ErrorMessage name="password" component="div" className="error-message" />
                                                      </>
                                                ) : (
                                                      <>
                                                            <label htmlFor="name">Username</label>
                                                            <Field type="text" autoFocus name="username" id="username" className={`login-input ${errors.username && touched.username ? 'input-error' : ''}`} />
                                                            <ErrorMessage name="username" component="div" className="error-message" />

                                                            <label htmlFor="email">Email Address</label>
                                                            <Field type="email" autoFocus name="email" id="email" className={`login-input ${errors.email && touched.email ? 'input-error' : ''}`} />
                                                            <ErrorMessage name="email" component="div" className="error-message" />

                                                            <label htmlFor="password">Password</label>
                                                            <Field type="password" name="password" id="password" className={`login-input ${errors.password && touched.password ? 'input-error' : ''}`} />
                                                            <ErrorMessage name="password" component="div" className="error-message" />

                                                            <label htmlFor="confirmPassword">Confirm Password</label>
                                                            <Field type="password" name="confirmPassword" id="confirmPassword" className={`login-input ${errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}`} />
                                                            <ErrorMessage name="confirmPassword" component="div" className="error-message" />

                                                            <label htmlFor="img-upload"></label>
                                                            <input type="file" name="img-upload" id="img-upload" className="login-input" />

                                                      </>
                                                )}
                                                <button className="bg-[#84a98c] transition-colors text-white duration-200 rounded-md p-2 my-2 hover:bg-[#638169]" type="submit">Submit</button>
                                                <button className="bg-[#cad2c5] rounded-md p-2 text-gray-500 transition-colors duration-200 hover:bg-[#bbc8b3]" type="button">Get Guest User Credentials</button>
                                          </Form>
                                    </>
                              )}
                        </Formik>
                  </div>
            </section>
      )
}

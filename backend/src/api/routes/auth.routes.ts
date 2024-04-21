import express from 'express'
import { signUpUserHandler, loginUserHandler, logoutUserHandler, sendResetPasswordMailHandler, resetPasswordHandler, validateUser } from '../controllers/auth.controller'
import upload from '@/middleware/multerMiddleware'
import { validate } from '@/middleware/validate'
import { loginUserSchema, resetPasswordSchema, sendResetPasswordMailSchema, signUpUserSchema } from '@/schemas/auth.schema'

export const router = express.Router()

router.post(
    '/signup',
    upload.single('profileImg'),
    validate(signUpUserSchema),
    signUpUserHandler
)

router.post(
    '/login',
    validate(loginUserSchema),
    loginUserHandler
)

router.put(
    '/logout',
    logoutUserHandler
)

router.post(
    '/send-reset-password-mail',
    validate(sendResetPasswordMailSchema),
    sendResetPasswordMailHandler
)

router.post(
    '/reset-password',
    validate(resetPasswordSchema),
    resetPasswordHandler
)

router.get(
    '/validate',
    validateUser
)

export { router as authRouter };

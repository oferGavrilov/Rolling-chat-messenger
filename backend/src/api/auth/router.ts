import express from 'express'
import { signUp, login, logoutUser, sendResetPasswordMail, resetPassword } from './controller.js'

export const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.put('/logout', logoutUser)
router.post('/send-reset-password-mail', sendResetPasswordMail)
router.post('/reset-password', resetPassword)

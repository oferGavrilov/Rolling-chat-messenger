import type { Response, Request } from "express"
import { generateRefreshToken, generateToken } from "../../config/generateToken.js"
import type { AuthenticatedRequest } from "../../models/types.js"
import { loginUser, resetPasswordConfirm, signUpService } from "./service.js"
import { EmailService } from "../../services/email.service.js"
import logger from "../../services/logger.service.js"
import { User } from "../../models/user.model.js"
import { ConflictError, InternalServerError } from "../../utils/errorHandler.js"

export async function signUp(req: AuthenticatedRequest, res: Response) {
    const { username, email, password } = req.body
    let { profileImg } = req.body

    if (!username) {
        return res.status(400).json({ msg: 'Username is required' })
    }
    if (!email) {
        return res.status(400).json({ msg: 'Email is required' })
    }
    if (!password) {
        return res.status(400).json({ msg: 'Password is required' })
    }

    profileImg = profileImg || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"

    try {
        const result = await signUpService(username, email, password, profileImg)
        const { user } = result

        if (!user) {
            throw new InternalServerError('Failed to create user')
        }

        const accessToken = generateToken(user._id)  // Short-lived
        const refreshToken = generateRefreshToken(user._id)  // Long-lived

        await User.findByIdAndUpdate(user._id, { refreshToken })

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            about: user.about,
            isOnline: true
        })

    } catch (error: unknown) {
        if (error instanceof ConflictError || error instanceof InternalServerError) {
            logger.error('Error during sign up:', error)
            return res.status(error.statusCode).json({ msg: error.message })
        } else {
            throw error
        }
    }
}

export async function login(req: AuthenticatedRequest, res: Response) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' })
        }

        const result = await loginUser(email, password)

        if (result.error) {
            return res.status(401).json({ msg: result.error })
        }

        const { user } = result

        if (user) {

            const accessToken = generateToken(user._id)  // Short-lived
            const refreshToken = generateRefreshToken(user._id)  // Long-lived

            await User.findByIdAndUpdate(user._id, { refreshToken })

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImg: user.profileImg,
                about: user.about,
                isOnline: true,
            })
        } else {
            throw new Error('User not found')
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error('Error during login:', error)
            return res.status(500).json({ msg: 'Internal server error' })
        } else {
            throw error
        }
    }
}

export async function logoutUser(_: Request, res: Response) {
    try {
        res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true })
        res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true })

        res.status(200).json({ message: 'User logged out successfully' })
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error('Error during logout:', error)
            return res.status(500).json({ msg: 'Internal server error' })
        } else {
            throw error
        }
    }
}

export async function sendResetPasswordMail(req: Request, res: Response) {
    const { email } = req.body
    try {
        const emailService = new EmailService()
        await emailService.sendResetPasswordMail(email)

        res.status(200).json({ message: 'Reset password email sent successfully' })
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error('Error during sendResetPasswordMail:', error)
            return res.status(500).json({ msg: 'Internal server error' })
        } else {
            throw error
        }
    }
}

export async function resetPassword(req: Request, res: Response) {
    const { token, password } = req.body

    if (!token || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' })
    }

    try {
        await resetPasswordConfirm(token, password)
        res.status(200).json({ message: 'Password reset successfully' })
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error('Error during resetPassword:', error)
            return res.status(500).json({ msg: 'Internal server error' })
        } else {
            throw error
        }
    }
}
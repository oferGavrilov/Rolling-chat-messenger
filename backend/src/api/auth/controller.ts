import { type Response, type Request, type CookieOptions } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { generateRefreshToken, generateToken } from "@/config/generateToken"
import { loginUser, resetPasswordConfirm, signUpService, validateRefreshTokenService } from "./service"
import { EmailService } from "@/services/email.service"
import { logger } from "@/server"
import { DEFAULT_GUEST_IMAGE, IUser, User } from "@/models/user.model"
import { env } from "@/utils/envConfig"
import { ResponseStatus, ServiceResponse } from "@/models/serviceResponse"
import { handleServiceResponse } from "@/utils/httpHandler"
import { uploadImageToCloudinary } from "@/services/cloudinary.service"

export async function signUp(req: Request, res: Response) {
    const { username, email, password } = req.body

    try {
        if (!username || !email || !password) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Username, email, and password are required',
            })
            return
        }

        const reqProfileImg = req.file

        let profileImgToSave: string = ''
        let TN_profileImgToSave: string = ''

        if (reqProfileImg) {
            const result = await uploadImageToCloudinary(reqProfileImg, 'profiles')
            profileImgToSave = result.originalImageUrl
            TN_profileImgToSave = result.tnImageUrl
        } else {
            profileImgToSave = DEFAULT_GUEST_IMAGE
            TN_profileImgToSave = ''
        }

        const serviceResponse = await signUpService(username, email, password, profileImgToSave, TN_profileImgToSave)

        if (!serviceResponse.success) {
            res.status(serviceResponse.statusCode).json({ message: serviceResponse.message })
            return
        }

        const user = serviceResponse.responseObject

        if (!user) {
            logger.error('User data not found after signup')
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' })
            return
        }

        const accessToken: string = generateToken(user._id)  // Short-lived
        const refreshToken: string = generateRefreshToken(user._id)  // Long-lived

        await User.findByIdAndUpdate(user._id, { refreshToken })

        const isProduction: boolean = process.env.NODE_ENV === 'production'

        const cookiesConfig: CookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: '/',
        }

        res.cookie('accessToken', accessToken, {
            ...cookiesConfig,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        })

        res.cookie('refreshToken', refreshToken, {
            ...cookiesConfig,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        handleServiceResponse(serviceResponse, res)

    } catch (ex) {
        const errorMessage = `Error during signup: ${(ex as Error).message}`
        logger.error(errorMessage)
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return new ServiceResponse(ResponseStatus.Failed, 'Please enter all fields', null, StatusCodes.BAD_REQUEST)
        }

        const serviceResponse = await loginUser(email, password)

        if (!serviceResponse.success) {
            return handleServiceResponse(serviceResponse, res)
        }

        const user = serviceResponse.responseObject

        if (user) {
            let refreshToken: string | undefined = user.refreshToken
            let shouldUpdateRefreshToken = false

            // Check if the refresh token is expired
            if (refreshToken) {
                try {
                    jwt.verify(refreshToken, env.JWT_REFRESH_SECRET)
                } catch (error) {
                    // Token is expired or invalid
                    shouldUpdateRefreshToken = true
                }
            } else {
                // No refresh token present
                shouldUpdateRefreshToken = true
            }

            if (shouldUpdateRefreshToken) {
                refreshToken = generateRefreshToken(user._id as string) // Long-lived
                await User.findByIdAndUpdate(user._id, { refreshToken })
            }

            const accessToken: string = generateToken(user._id as string) // Short-lived

            const isProduction: boolean = process.env.NODE_ENV === 'production'

            const cookiesConfig: CookieOptions = {
                httpOnly: true,
                secure: isProduction,
                sameSite: "lax",
                path: '/',
            }

            res.cookie('accessToken', accessToken, {
                ...cookiesConfig,
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            })

            res.cookie('refreshToken', refreshToken, {
                ...cookiesConfig,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })

            // remove the refresh token from the response object
            delete user.refreshToken

            handleServiceResponse(serviceResponse, res)
        } else {
            return new ServiceResponse(ResponseStatus.Failed, 'Invalid email or password', null, StatusCodes.FORBIDDEN)
        }
    } catch (error: unknown) {
        const errorMessage = `Error during login: ${(error as Error).message}`
        logger.error(errorMessage)
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function validateUser(req: Request, res: Response) {
    const { accessToken, refreshToken } = req.cookies

    if (!refreshToken) {
        // No refresh token found, unauthorized
        return new ServiceResponse(ResponseStatus.Failed, 'No refresh token found', { isValid: false }, StatusCodes.UNAUTHORIZED)
    }

    // Validate the refresh token
    const serviceResponse = await validateRefreshTokenService(refreshToken)
    const validationResponse: { isValid: boolean, user?: Partial<IUser> } = serviceResponse.responseObject

    if (!validationResponse.isValid || !validationResponse.user) {
        // Refresh token is invalid, unauthorized
        return handleServiceResponse(serviceResponse, res)
    }

    const isProduction: boolean = env.NODE_ENV === 'production'
    const cookiesConfig: CookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: '/',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }

    let shouldUpdateAccessToken = true

    // Try to verify the access token (if it exists)
    let newAccessToken = accessToken
    if (accessToken) {
        try {
            jwt.verify(accessToken, env.JWT_SECRET) as { id: string }
            shouldUpdateAccessToken = false // Access token is still valid, no need to update
        } catch (error) {
            shouldUpdateAccessToken = true // Access token is invalid, generate a new one
        }
    }

    // Generate a new access token if necessary (either expired or not provided)
    if (shouldUpdateAccessToken) {
        newAccessToken = generateToken(validationResponse.user?._id as string)
        res.cookie('accessToken', newAccessToken, cookiesConfig)
    }

    return handleServiceResponse(serviceResponse, res)
}

export async function logoutUser(req: Request, res: Response) {
    const { userId } = req.body
    try {
        const isProduction: boolean = process.env.NODE_ENV === 'production'

        const cookiesConfig: CookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: '/',
        }

        res.cookie('accessToken', '', {
            ...cookiesConfig,
            expires: new Date(0),
        })

        res.cookie('refreshToken', '', {
            ...cookiesConfig,
            expires: new Date(0),
        })

        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() })

        return res.status(200).json({ message: 'User logged out successfully' })
    } catch (error: unknown) {
        const errorMessage = `Error during logoutUser: ${(error as Error).message}`
        logger.error(errorMessage)
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function sendResetPasswordMail(req: Request, res: Response) {
    const { email } = req.body
    const emailService = new EmailService()
    await emailService.sendResetPasswordMail(email)

    res.status(200).json({ message: 'Reset password email sent successfully' })
}

export async function resetPassword(req: Request, res: Response) {
    const { token, password } = req.body

    if (!token || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' })
    }

    await resetPasswordConfirm(token, password)
    res.status(200).json({ message: 'Password reset successfully' })
}

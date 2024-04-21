import { type Response, type Request, type CookieOptions, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { generateRefreshToken, generateToken } from "@/config/generateToken"
import { loginUserService, resetPasswordConfirm, signUpService, validateRefreshTokenService } from "../services/auth.service"
import { EmailService } from "@/utils/email"
import { logger } from "@/server"
import { DEFAULT_GUEST_IMAGE, IUser, User } from "@/models/user.model"
import { env } from "@/utils/envConfig"
import { ResponseStatus, ServiceResponse } from "@/models/serviceResponse"
import { handleServiceResponse } from "@/utils/httpHandler"
import { uploadImageToCloudinary } from "@/utils/cloudinary"
import { LoginUserInput, ResetPasswordInput, SendResetPasswordMailInput, SignUpUserInput } from "@/schemas/auth.schema"

export async function signUpUserHandler(
    req: Request<{}, SignUpUserInput>,
    res: Response
) {
    const { username, email, password } = req.body

    try {
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

export async function loginUserHandler(
    req: Request<LoginUserInput>,
    res: Response,
    next: NextFunction
) {
    try {
        const { email, password } = req.body
        const serviceResponse = await loginUserService(email, password)

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
        next(new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

export async function validateUser(req: Request, res: Response) {
    const { accessToken, refreshToken } = req.cookies

    if (!refreshToken) {
        // No refresh token found, unauthorized or expired token
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'expired' })
        return
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

export async function logoutUserHandler(req: Request, res: Response) {
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

export async function sendResetPasswordMailHandler(
    req: Request<SendResetPasswordMailInput>,
    res: Response
) {
    const { email } = req.body
    const emailService = new EmailService()
    await emailService.sendResetPasswordMail(email)

    res.status(200).json({ message: 'Reset password email sent successfully' })
}

export async function resetPasswordHandler(
    req: Request<ResetPasswordInput>,
    res: Response,
) {
    const { token, password } = req.body

    const serviceResponse = await resetPasswordConfirm(token, password)
    handleServiceResponse(serviceResponse, res)
}

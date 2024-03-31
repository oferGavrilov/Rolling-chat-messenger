import type { Response, Request, CookieOptions } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { generateRefreshToken, generateToken } from "@/config/generateToken"
import { loginUser, resetPasswordConfirm, signUpService, validateRefreshTokenService } from "./service"
import { EmailService } from "@/services/email.service"
import { logger } from "@/server"
import { IUser, User } from "@/models/user.model"
import { InternalServerError } from "@/middleware/errorHandler"
import { env } from "@/utils/envConfig"
import { ResponseStatus, ServiceResponse } from "@/models/serviceResponse"
import { handleServiceResponse } from "@/utils/httpHandler"
import { format } from 'date-fns'

export async function signUp(req: Request, res: Response) {
    const { username, email, password, profileImg = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" } = req.body;

    if (!username || !email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Username, email, and password are required',
        });
        return;
    }

    try {
        const serviceResponse = await signUpService(username, email, password, profileImg);

        if (!serviceResponse.success) {
            res.status(serviceResponse.statusCode).json({ message: serviceResponse.message });
            return;
        }

        const user = serviceResponse.responseObject;

        if (!user) {
            logger.error('User data not found after signup');
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
            return;
        }

        const accessToken: string = generateToken(user._id)  // Short-lived
        const refreshToken: string = generateRefreshToken(user._id)  // Long-lived

        await User.findByIdAndUpdate(user._id, { refreshToken })

        const isProduction: boolean = process.env.NODE_ENV === 'production';

        const cookiesConfig: CookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: '/',
        }

        res.cookie('accessToken', accessToken, {
            ...cookiesConfig,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        res.cookie('refreshToken', refreshToken, {
            ...cookiesConfig,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // return res.status(201).json({
        //     _id: user._id,
        //     username: user.username,
        //     email: user.email,
        //     profileImg: user.profileImg,
        //     about: user.about,
        // })
        handleServiceResponse(serviceResponse, res)

    } catch (ex) {
        const errorMessage = `Error during signup: ${(ex as Error).message}`
        logger.error(errorMessage)
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return new ServiceResponse(ResponseStatus.Failed, 'Please enter all fields', null, StatusCodes.BAD_REQUEST)
        }

        const serviceResponse = await loginUser(email, password);

        if (!serviceResponse.success) {
            return handleServiceResponse(serviceResponse, res)
        }

        const user = serviceResponse.responseObject;

        if (user) {
            let refreshToken: string | undefined = user.refreshToken;
            let shouldUpdateRefreshToken = false;

            // Check if the refresh token is expired
            if (refreshToken) {
                try {
                    jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
                } catch (error) {
                    // Token is expired or invalid
                    shouldUpdateRefreshToken = true;
                }
            } else {
                // No refresh token present
                shouldUpdateRefreshToken = true;
            }

            if (shouldUpdateRefreshToken) {
                refreshToken = generateRefreshToken(user._id as string); // Long-lived
                await User.findByIdAndUpdate(user._id, { refreshToken });
            }

            const accessToken: string = generateToken(user._id as string); // Short-lived

            const isProduction: boolean = process.env.NODE_ENV === 'production';

            const cookiesConfig: CookieOptions = {
                httpOnly: true,
                secure: isProduction,
                sameSite: "lax",
                path: '/',
            };

            res.cookie('accessToken', accessToken, {
                ...cookiesConfig,
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });

            res.cookie('refreshToken', refreshToken, {
                ...cookiesConfig,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            handleServiceResponse(serviceResponse, res)
        } else {
            return new ServiceResponse(ResponseStatus.Failed, 'Invalid email or password', null, StatusCodes.FORBIDDEN)
        }
    } catch (error: unknown) {
        const errorMessage = `Error during login: ${(error as Error).message}`;
        logger.error(errorMessage);
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export async function validateUser(req: Request, res: Response) {
    const { accessToken, refreshToken } = req.cookies

    if (!refreshToken) {
        return new ServiceResponse(ResponseStatus.Failed, 'No refresh token found', { isValid: false }, StatusCodes.UNAUTHORIZED)
    }

    const serviceResponse = await validateRefreshTokenService(refreshToken)
    const validationResponse: { isValid: boolean, user?: Partial<IUser> } = serviceResponse.responseObject
    console.log('validationResponse', validationResponse)

    if (validationResponse.isValid && validationResponse.user) {
        const isProduction: boolean = process.env.NODE_ENV === 'production';
        const cookiesConfig: CookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: '/',
        }

        if (accessToken) {
            const decoded = jwt.verify(accessToken, env.JWT_SECRET) as { id: string }
            if (!decoded) {
                return handleServiceResponse(serviceResponse, res)
            }

            // update the maxAge of the accessToken
            res.cookie('accessToken', accessToken, {
                ...cookiesConfig,
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
        } else {
            // generate new access token
            const newAccessToken = generateToken(validationResponse.user._id as string)
            res.cookie('accessToken', newAccessToken, {
                ...cookiesConfig,
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
        }

        handleServiceResponse(serviceResponse, res)
    } else {
        return handleServiceResponse(serviceResponse, res)
    }
}

export async function logoutUser(req: Request, res: Response) {
    const { userId } = req.body
    try {
        const isProduction: boolean = process.env.NODE_ENV === 'production';

        const cookiesConfig: CookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: '/',
        }

        res.cookie('accessToken', '', {
            ...cookiesConfig,
            expires: new Date(0),
        });

        res.cookie('refreshToken', '', {
            ...cookiesConfig,
            expires: new Date(0),
        });

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

import { IUser, User } from "@/models/user.model"
import jwt from 'jsonwebtoken'
import { env } from "@/utils/envConfig"
import { ResponseStatus, ServiceResponse } from "@/models/serviceResponse"
import { StatusCodes } from "http-status-codes"
import { logger } from "@/server"

interface SignUpResult {
    _id: string
    username: string
    email: string
    profileImg: string
    TN_profileImg: string
    about: string
}

export async function signUpService(username: string, email: string, password: string, profileImg: string, TN_profileImg: string): Promise<ServiceResponse<SignUpResult | null>> {
    try {
        const userExists = await User.findOne({ email })

        if (userExists) {
            return new ServiceResponse(ResponseStatus.Failed, 'User already exists', null, StatusCodes.CONFLICT)
        }

        const newUser = await User.create({
            username,
            email,
            password,
            profileImg,
            TN_profileImg,
            about: User.schema.path('about').default('Available'),
            isOnline: true,
        })

        const userResponse: SignUpResult = {
            _id: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
            profileImg: newUser.profileImg,
            TN_profileImg: newUser.TN_profileImg,
            about: newUser.about
        }

        return new ServiceResponse(ResponseStatus.Success, 'User created successfully', userResponse, StatusCodes.OK);
    } catch (error) {
        const errorMessage = `Error creating user: ${(error as Error).message}`
        logger.error(errorMessage)
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function loginUser(email: string, password: string): Promise<ServiceResponse<Partial<IUser> | null>> {
    try {

        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return new ServiceResponse(ResponseStatus.Failed, 'Invalid email or password', null, StatusCodes.UNAUTHORIZED)
        }

        const passwordMatch = await user.verifyPassword(password)
        if (!passwordMatch) {
            return new ServiceResponse(ResponseStatus.Failed, 'Invalid email or password', null, StatusCodes.UNAUTHORIZED)
        }

        // change the user's status to online when they log in
        user.isOnline = true

        // if the profileImg is start with http fix it to https
        if (user.profileImg && user.profileImg.startsWith('http://')) {
            user.profileImg = user.profileImg.replace('http://', 'https://')
        }

        await user.save()

        const userResponse: Partial<IUser> = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            about: user.about,
            refreshToken: user.refreshToken
        }

        return new ServiceResponse(ResponseStatus.Success, 'User logged in successfully', userResponse, StatusCodes.OK)

    } catch (err) {
        const errorMessage = `Error during login: ${(err as Error).message}`
        logger.error(errorMessage)
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function validateRefreshTokenService(refreshToken: string): Promise<ServiceResponse<{ isValid: boolean, user?: Partial<IUser> }>> {
    try {
        const decodedAccess = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string }

        if (!decodedAccess) {
            console.log('no decoded access')
            return new ServiceResponse(ResponseStatus.Failed, 'Token is invalid', { isValid: false }, StatusCodes.UNAUTHORIZED)
        }

        const user = await User.findById(decodedAccess.id)

        if (!user) {
            console.log('no user')
            return new ServiceResponse(ResponseStatus.Failed, 'User not found', { isValid: false }, StatusCodes.UNAUTHORIZED)
        }

        const userResponse: Partial<IUser> = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            TN_profileImg: user.TN_profileImg,
            about: user.about
        }
        return new ServiceResponse(ResponseStatus.Success, 'Token is valid', { isValid: true, user: userResponse }, StatusCodes.OK)

    } catch (error) {
        const errorMessage = `Error validating refresh token: ${(error as Error).message}`
        logger.error(errorMessage)
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, { isValid: false }, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function resetPasswordConfirm(token: string, password: string): Promise<void> {
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        })

        if (!user) {
            throw new Error('Password reset token is invalid or has expired.')
        }

        if (user) {
            user.password = password
            user.resetPasswordToken = undefined
            user.resetPasswordExpires = undefined
            await user.save()
        } else {
            throw new Error('User not found')
        }
    } catch (error: unknown) {
        const errorMessage = `Error resetting password: ${(error as Error).message}`
        logger.error(errorMessage)
        throw new Error(errorMessage)
    }
}

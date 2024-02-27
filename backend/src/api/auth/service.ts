import { User } from "../../models/user.model.js"
import { handleErrorService } from "../../middleware/errorMiddleware.js"
import { ConflictError, NotFoundError, UnauthorizedError } from "../../utils/errorHandler.js"
import jwt from 'jsonwebtoken'
import { generateToken } from "../../config/generateToken.js"
interface SignUpResult {
    user: {
        _id: string
        username: string
        email: string
        profileImg: string
        about: string
    }
}

export async function signUpService(username: string, email: string, password: string, profileImg: string): Promise<SignUpResult> {
    const userExists = await User.findOne({ email })

    if (userExists) {
        throw new ConflictError('User already exists')
    }

    const newUser = await User.create({
        username,
        email,
        password,
        profileImg,
        about: User.schema.path('about').default('Available'),
        isOnline: true,
    })

    return {
        user: {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profileImg: newUser.profileImg,
            about: newUser.about
        }
    }
}

export async function loginUser(email: string, password: string): Promise<{ user?: Partial<User>, error?: string }> {
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        throw new NotFoundError('Invalid email or password')
    }

    const passwordMatch = await user.verifyPassword(password)
    if (!passwordMatch) {
        throw new NotFoundError('Invalid email or password')
    }

    // change the user's status to online when they log in
    user.isOnline = true
    await user.save()

    return {
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            about: user.about,
            refreshToken: user.refreshToken
        }
    }
}

export async function validateTokenService(accessToken: string, refreshToken: string) {
    try {
        const decodedAccess = jwt.verify(accessToken, process.env.JWT_SECRET) as { id: string }
        const user = await User.findById(decodedAccess.id)

        if (!user) {
            throw new Error('User not found')
        }

        return { isValid: true, user, accessToken }
    } catch (accessError) {
        try {
            const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as { id: string }
            const user = await User.findOne({ _id: decodedRefresh.id, refreshToken })

            if (!user) {
                throw new UnauthorizedError('User not found')
            }

            const newAccessToken = generateToken(user._id)

            return { isValid: true, user, accessToken: newAccessToken }
        } catch (refreshError) {
            console.log('refreshError ', refreshError)
            return { isValid: false }
        }
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
        if (error instanceof Error) {
            throw handleErrorService(error)
        } else {
            throw error
        }
    }
}

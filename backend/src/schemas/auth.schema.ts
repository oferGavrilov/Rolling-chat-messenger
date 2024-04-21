import { TypeOf, z } from 'zod'

export const signUpUserSchema = z.object({
    body: z.object({
        username: z.string({ required_error: 'Username is required' }).min(3, { message: 'Username must be at least 3 characters long' }).max(20, { message: 'Username must be at most 20 characters long' }),
        email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email format' }),
        password: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters long' }),
        confirmPassword: z.string({ required_error: 'Confirm password is required' }).min(6, { message: 'Confirm password must be at least 6 characters long' })
    }).refine(data => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] }),
    file: z.object({
        originalname: z.string(),
        mimetype: z.enum(['image/jpeg', 'image/png'], { required_error: 'Invalid file type' }),
        size: z.number(),
        buffer: z.instanceof(Buffer)
    }).optional().nullable()
})

export const loginUserSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email format' }),
        password: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters long' })
    })
})

export const sendResetPasswordMailSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email format' })
    })
})

export const resetPasswordSchema = z.object({
    body: z.object({
        password: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters long' }),
        confirmPassword: z.string({ required_error: 'Confirm password is required' }).min(6, { message: 'Confirm password must be at least 6 characters long' }),
        token: z.string({ required_error: 'Token is required' })
    }).refine(data => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })
})

export type SignUpUserInput = TypeOf<typeof signUpUserSchema>['body'] & { profileImg?: Express.Multer.File }
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body']
export type SendResetPasswordMailInput = TypeOf<typeof sendResetPasswordMailSchema>['body']
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>['body']
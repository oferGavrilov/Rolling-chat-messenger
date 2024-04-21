import {TypeOf, z} from 'zod'

export const getUserStatusSchema = z.object({
    params: z.object({
        userId: z.string({required_error: 'User ID is required'})
    })
})

export const editUserDetailsSchema = z.object({
    body: z.object({
        newName: z.string({required_error: 'New name is required'}).min(3, {message: 'New name must be at least 3 characters long'}).max(20, {message: 'New name must be at most 20 characters long'}),
        fieldToUpdate: z.enum(['username', 'about'], {required_error: 'Field to update is required'})
    })
})

export const editUserImageSchema = z.object({
    file: z.object({
        originalname: z.string(),
        mimetype: z.enum(['image/jpeg', 'image/png'], {required_error: 'Invalid file type'}),
        size: z.number(),
        buffer: z.instanceof(Buffer)
    })
})

export type GetUserStatusInput = TypeOf<typeof getUserStatusSchema>['params']
export type EditUserDetailsInput = TypeOf<typeof editUserDetailsSchema>['body']
export type EditUserImageInput = TypeOf<typeof editUserImageSchema>['file']
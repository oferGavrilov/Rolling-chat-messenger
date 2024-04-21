import { TypeOf, z } from 'zod'

export const getAllMessagesSchema = z.object({
    params: z.object({
        chatId: z.string({ required_error: 'Chat ID is required' })
    })
})

export const sendMessageSchema = z.object({
    body: z.object({
        content: z.string().optional(),
        chatId: z.string().min(1, { message: 'Chat ID is required' }),
        messageType: z.enum(['text', 'image', 'file'], { required_error: 'Message type is required' }),
        messageSize: z.string().optional().transform(value => parseInt(value as string, 10)),
        replyMessage: z.string().optional().nullable(),
    }),
    file: z.object({
        originalname: z.string(),
        mimetype: z.enum(['image/jpeg', 'image/png', 'application/pdf'], { required_error: 'Invalid file type' }),
        size: z.number(),
        buffer: z.unknown(),
    }).optional()
}).superRefine((data, ctx) => {
    if (data.body.messageType === 'text') {
        if (!data.body.content?.trim()) {
            ctx.addIssue({
                path: ['body', 'content'],
                message: 'Content cannot be empty',
                code: z.ZodIssueCode.custom
            })
        }

        if (data.body.content && data.body.content.length > 700) {
            ctx.addIssue({
                path: ['body', 'content'],
                message: 'Text message cannot be more than 700 characters',
                code: z.ZodIssueCode.custom
            })
        }
    }
    if (data.body.messageType === 'image' || data.body.messageType === 'file') {
        if (!data.file) {
            ctx.addIssue({
                path: ['file'],
                message: 'File is required for image or file messages',
                code: z.ZodIssueCode.custom
            })
        }

    }
})

export const removeMessageSchema = z.object({
    params: z.object({
        messageId: z.string({ required_error: 'Message ID is required' }),
        chatId: z.string({ required_error: 'Chat ID is required' })
    }),
    body: z.object({
        deletionType: z.enum(['forMe', 'forEveryone'], { required_error: 'Deletion type is required' })
    })
})

export type GetAllMessagesInput = TypeOf<typeof getAllMessagesSchema>['params']
export type SendMessageInput = TypeOf<typeof sendMessageSchema>['body'] & { file: Express.Multer.File | null }
export type RemoveMessageInput = TypeOf<typeof removeMessageSchema>['params'] & TypeOf<typeof removeMessageSchema>['body']

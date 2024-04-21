import express from 'express'
import { authMiddleware } from '@/middleware/authMiddleware'
import { getAllMessagesHandler, removeMessageHandler, sendMessageHandler } from '../controllers/message.controller'
import upload from '@/middleware/multerMiddleware'
import { validate } from '@/middleware/validate'
import { getAllMessagesSchema, removeMessageSchema, sendMessageSchema } from '@/schemas/message.schema'

const router = express.Router()

router.use(authMiddleware)

router.get(
    '/:chatId',
    validate(getAllMessagesSchema),
    getAllMessagesHandler
)

router.post(
    '/',
    upload.single('file'),
    validate(sendMessageSchema),
    sendMessageHandler
)

router.delete(
    '/remove/:chatId/:messageId',
    validate(removeMessageSchema),
    removeMessageHandler
)

export { router as messageRouter };

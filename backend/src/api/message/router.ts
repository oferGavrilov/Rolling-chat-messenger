import express from 'express'
import { authMiddleware } from '@/middleware/authMiddleware'
import { removeMessage, getAllMessages, sendMessage } from './controller'
import upload from '@/middleware/multerMiddleware'

export const router = express.Router()

router.get('/:chatId', authMiddleware, getAllMessages)
router.post('/', authMiddleware, upload.single('file'), sendMessage)
router.delete('/remove/:chatId/:messageId', authMiddleware, removeMessage)

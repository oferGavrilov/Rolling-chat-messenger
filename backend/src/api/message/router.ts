import express from 'express'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { removeMessage, getAllMessages, sendMessage } from './controller.js'

export const router = express.Router()

router.get('/:chatId', authMiddleware, getAllMessages)
router.post('/', authMiddleware, sendMessage)
router.delete('/remove/:chatId/:messageId', authMiddleware, removeMessage)

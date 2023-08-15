import express from 'express'
import { protect } from '../../middleware/authMiddleware.js'
import { getAllMessages, sendMessage } from './controller.js'

export const router = express.Router()

router.post('/', protect , sendMessage)

router.get('/:chatId', protect , getAllMessages)
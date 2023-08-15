import express from 'express';
import { protect } from '../../middleware/authMiddleware';
import { getAllMessages, sendMessage } from './controller';
export const router = express.Router();
router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getAllMessages);

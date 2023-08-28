import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { deleteMessage, getAllMessages, sendMessage } from './controller.js';
export const router = express.Router();
router.get('/:chatId', authMiddleware, getAllMessages);
router.post('/', authMiddleware, sendMessage);
router.delete('/remove/:chatId/:messageId', authMiddleware, deleteMessage);
//# sourceMappingURL=router.js.map
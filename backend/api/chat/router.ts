import express from 'express'
import { protect } from '../../middleware/authMiddleware'
import { addToGroupChat, createChat, createGroupChat, getChats, getUserChats, removeFromGroupChat, renameGroupChat } from './controller'

export const router = express.Router()

router.post('/', protect, createChat)
router.post('/group', protect, createGroupChat)
router.get('/', protect, getChats)
router.get('/chat/:userId', protect, getUserChats)
router.put('/rename', protect, renameGroupChat)
router.put('/groupadd', protect, addToGroupChat)
router.put('/groupremove', protect, removeFromGroupChat)
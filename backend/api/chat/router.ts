import express from 'express'
import { admin, protect } from '../../middleware/authMiddleware'
import { addToGroupChat, createChat, createGroupChat, getChats, getUserChats, removeFromGroupChat, renameGroupChat, updateGroupImage } from './controller'

export const router = express.Router()

router.post('/', protect, createChat)
router.post('/group', protect, createGroupChat)
router.get('/', protect, getChats)
router.get('/chat/:userId', protect, getUserChats) //TODO: change to /:chatId
router.put('/rename', admin, renameGroupChat)
router.put('/groupimage', protect, updateGroupImage)
router.put('/groupadd', protect, addToGroupChat)
router.put('/groupremove', protect, removeFromGroupChat)
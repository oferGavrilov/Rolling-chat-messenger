import express from 'express'
import { admin, protect } from '../../middleware/authMiddleware'
import { updateUsersInGroupChat, createChat, createGroupChat, getChats, getUserChats, removeFromGroupChat, renameGroupChat, updateGroupImage, removeChat } from './controller'

export const router = express.Router()

router.post('/', protect, createChat)
router.post('/group', protect, createGroupChat)
router.get('/', protect, getChats)
router.get('/chat/:userId', protect, getUserChats) //TODO: change to /:chatId
router.put('/rename', admin, renameGroupChat)
router.put('/groupimage', protect, updateGroupImage)
router.put('/updateusers', admin, updateUsersInGroupChat)
router.put('/groupremove', protect, removeFromGroupChat)
router.put('/remove', protect, removeChat)
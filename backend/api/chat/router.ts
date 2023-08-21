import express from 'express'
import { admin, protect } from '../../middleware/authMiddleware.js'
import { updateUsersInGroupChat, createChat, createGroupChat, getUserChats, kickFromGroupChat, renameGroupChat, updateGroupImage, removeChat, leaveGroup } from './controller.js'

export const router = express.Router()

router.post('/', protect, createChat)
router.post('/group', protect, createGroupChat)
router.get('/chat/:userId', protect, getUserChats) //TODO: change to /:chatId
router.put('/rename', admin, renameGroupChat)
router.put('/groupimage', protect, updateGroupImage)
router.put('/updateusers', admin, updateUsersInGroupChat)
router.put('/kick', protect, kickFromGroupChat)
router.put('/leave', protect, leaveGroup)
router.put('/remove', protect, removeChat)
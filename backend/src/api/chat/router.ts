import express from 'express'
import { authMiddleware, groupAdminMiddleware } from '../../middleware/authMiddleware.js'
import {
      updateUsersInGroupChat,
      createChat,
      createGroupChat,
      getUserChats,
      kickFromGroupChat,
      renameGroupChat,
      updateGroupImage,
      removeChat,
      leaveGroup
} from './controller.js'

export const router = express.Router()

router.get('/:userId', authMiddleware, getUserChats) 
router.post('/createchat', authMiddleware, createChat)
router.post('/creategroup', authMiddleware, createGroupChat)
router.put('/rename', groupAdminMiddleware, renameGroupChat)
router.put('/groupimage', groupAdminMiddleware, updateGroupImage)
router.put('/updateusers', groupAdminMiddleware, updateUsersInGroupChat)
router.put('/kick', groupAdminMiddleware, kickFromGroupChat)
router.put('/leave', authMiddleware, leaveGroup)
router.put('/remove', authMiddleware, removeChat)
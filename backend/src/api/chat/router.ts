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

router.get('/', authMiddleware, getUserChats)
router.post('/createchat', authMiddleware, createChat)
router.post('/creategroup', authMiddleware, createGroupChat)
router.put('/leave', authMiddleware, leaveGroup)
router.put('/remove', authMiddleware, removeChat)
router.put('/rename', authMiddleware, groupAdminMiddleware, renameGroupChat)
router.put('/groupimage', authMiddleware, groupAdminMiddleware, updateGroupImage)
router.put('/updateusers', authMiddleware, groupAdminMiddleware, updateUsersInGroupChat)
router.put('/kick', authMiddleware, groupAdminMiddleware, kickFromGroupChat)
import express from 'express'
import { getUsers, editUserDetails, editUserImage } from './controller.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

export const router = express.Router()

router.get('/all', authMiddleware, getUsers)
router.put('/details', authMiddleware, editUserDetails)
router.put('/image', authMiddleware, editUserImage)
import express from 'express'
import { getUsers, editUserDetails, editUserImage, getUserStatus } from './controller'
import { authMiddleware } from '@/middleware/authMiddleware'
import upload from '@/middleware/multerMiddleware'

export const router = express.Router()

router.get('/all', authMiddleware, getUsers)
router.get('/status/:userId', authMiddleware, getUserStatus)
router.put('/details', authMiddleware, editUserDetails)
router.put('/image', authMiddleware, upload.single('profileImg'), editUserImage)
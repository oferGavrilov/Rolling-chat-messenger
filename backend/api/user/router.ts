import express from 'express'
import { signUp, login, getUsers, searchUsersByKeyword, editUserDetails, editUserImage } from './controller'
import { protect } from '../../middleware/authMiddleware'

export const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.get('/', protect, searchUsersByKeyword)
router.get('/all', protect, getUsers)
router.put('/details', protect, editUserDetails)
router.put('/image', protect, editUserImage)

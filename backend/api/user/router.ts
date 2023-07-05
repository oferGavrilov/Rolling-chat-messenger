import express from 'express'
import { signUp, login, getUsers, searchUsersByKeyword, editUserDetails } from './controller'
import { protect } from '../../middleware/authMiddleware'

export const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.get('/', protect, searchUsersByKeyword)
router.get('/all', protect, getUsers)
router.put('/details', protect, editUserDetails)

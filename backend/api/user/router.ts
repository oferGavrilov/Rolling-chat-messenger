import express from 'express'
import { signUp, login, getUsers, searchUsersByKeyword, editUserDetails, editUserImage, logoutUser } from './controller.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

export const router = express.Router()

// router.get('/', protect, searchUsersByKeyword)
router.get('/all/:userId?',authMiddleware, getUsers)
router.post('/signup', signUp)
router.post('/login', login)
router.put('/logout' , authMiddleware, logoutUser)
router.put('/details', authMiddleware, editUserDetails) //TODO: merge this two routes into one
router.put('/image', authMiddleware, editUserImage) //TODO: merge this two routes into one

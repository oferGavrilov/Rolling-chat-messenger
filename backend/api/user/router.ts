import express from 'express'
import { signUp, login, getUsers } from './controller'
import { protect } from '../../middleware/authMiddleware'

export const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.get('/',protect, getUsers)

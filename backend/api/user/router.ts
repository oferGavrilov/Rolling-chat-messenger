import express from 'express'
import { signUp, login } from './controller'

export const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)

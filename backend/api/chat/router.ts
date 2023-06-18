import express from 'express'
import { protect } from '../../middleware/authMiddleware'
import { createChat } from './controller'

export const router = express.Router()

router.post('/', protect, createChat)
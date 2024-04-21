import { authMiddleware } from '@/middleware/authMiddleware'
import express from 'express'
import { validate } from '@/middleware/validate'
import { editUserDetailsSchema, editUserImageSchema, getUserStatusSchema } from '@/schemas/user.schema'
import { editUserDetailsHandler, editUserImageHandler, getUserStatusHandler, getUsersHandler } from '../controllers/user.controller'
import upload from '@/middleware/multerMiddleware'

const router = express.Router()

router.get(
    '/all',
    authMiddleware,
    getUsersHandler
)

router.get(
    '/status/:userId',
    authMiddleware,
    validate(getUserStatusSchema),
    getUserStatusHandler
)

router.put(
    '/details',
    authMiddleware,
    validate(editUserDetailsSchema),
    editUserDetailsHandler
)

router.put(
    '/image',
    authMiddleware,
    upload.single('profileImg'),
    validate(editUserImageSchema),
    editUserImageHandler
)

export { router as userRouter };

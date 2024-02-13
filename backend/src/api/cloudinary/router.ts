import express from 'express'
import { handleImageUploadToCloudinary } from './controller.js'
import multer from 'multer'
export const router = express.Router()

const upload = multer({})

router.post('/upload', upload.single('image'), handleImageUploadToCloudinary)
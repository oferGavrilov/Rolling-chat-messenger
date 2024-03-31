import express from "express"
import multer from "multer"
import { authMiddleware } from "@/middleware/authMiddleware"
import { createGallery, deleteGallery, getGallery } from "./controller"

const upload = multer({ dest: 'uploads/' })
export const router = express.Router()

router.get('/', authMiddleware, getGallery)
router.post('/', authMiddleware, upload.single('image'), createGallery)
router.delete('/:id', authMiddleware, deleteGallery)
// router.put('/:id', authMiddleware, updateGallery)
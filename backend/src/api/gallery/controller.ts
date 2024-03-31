import { Request, Response } from "express";
// import { IGalleryResponse } from "../../models/gallery.model.js";
import { createGalleryService, deleteGalleryService, getGalleryService } from "./service.js";
import { handleServiceResponse } from "@/utils/httpHandler.js";

export async function getGallery(req: Request, res: Response) {
    const userId = req.user._id

    const gallery = await getGalleryService(userId)
    handleServiceResponse(gallery, res)
}

export async function createGallery(req: Request, res: Response) {
    const { title } = req.body
    const file = req.file
    const userId = req.user._id

    if (!title) return res.status(400).json({ message: 'Title are required' })
    if (!file) return res.status(400).json({ message: 'File are required' })

    const gallery = await createGalleryService(file.path, title, userId)
    handleServiceResponse(gallery, res)
}

export async function deleteGallery(req: Request, res: Response) {
    const id = req.params.id
    const userId = req.user._id

    if (!id) return res.status(400).json({ message: 'Galley ID is required' })

    const response = await deleteGalleryService(id, userId);
    handleServiceResponse(response, res)
}

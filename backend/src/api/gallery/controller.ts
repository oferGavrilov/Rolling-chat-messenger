import { IGalleryRequest, IGalleryResponse } from "src/models/gallery.model";
import { createGalleryService, getGalleryService } from "./service";


export async function getGallery(req: IGalleryRequest, res: IGalleryResponse) {
    const userId = req.user._id

    try {
        const gallery = await getGalleryService(userId)
        return res.status(200).json(gallery)
    } catch (error) {
        console.log(error)
    }
}

export async function createGallery(req: IGalleryRequest, res: IGalleryResponse) {
    const { title } = req.body
    const file = req.file

    if (!title) {
        return res.status(400).json({ message: 'Title are required' })
    }

    if (!file) {
        return res.status(400).json({ message: 'File are required' })
    }

    const userId = req.user._id

    try {
        const gallery = await createGalleryService(file.path, title, userId)
        return res.status(201).json(gallery)
    } catch (error) {
        console.log(error)
    }
}
import { IGalleryRequest, IGalleryResponse } from "../../models/gallery.model.js";
import { createGalleryService, deleteGalleryService, getGalleryService } from "./service.js";


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

export async function deleteGallery(req: IGalleryRequest, res: IGalleryResponse) {
    const id = req.params.id
    const userId = req.user._id

    try {
        await deleteGalleryService(id, userId);
        // If the service does not throw an error, deletion was successful
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        // Respond with false if there was an error during deletion
        return res.status(500).json({ success: false, message: 'Failed to delete gallery item.' });
    }
}
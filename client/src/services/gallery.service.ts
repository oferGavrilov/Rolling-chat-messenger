import { IGallery } from "../model/gallery"
import { httpService } from "./http.service"

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://server.rolling-chat.com' : 'http://localhost:5000'

export const galleryService = {
    getGallery,
    createGallery
}

async function getGallery(): Promise<IGallery[]> {
    return await httpService.get(`${BASE_URL}/api/gallery`, {}) as IGallery[]
}

async function createGallery(formData: FormData): Promise<IGallery> {
    return await httpService.post(`${BASE_URL}/api/gallery`, formData)
}
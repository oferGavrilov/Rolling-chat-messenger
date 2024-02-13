import { httpService } from "./http.service"

export const cloudinaryService = {
    uploadImageToCloudinary
}

async function uploadImageToCloudinary(file: FormData): Promise<string> {
    try {
        return await httpService.post<string>('/api/cloudinary/upload', file)
    } catch (error) {
        console.error(error)
        throw error
    }
}

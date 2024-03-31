import axios from "axios";

export const cloudinaryService = {
    uploadImageToCloudinary
}


// normal function to upload image to cloudinary
async function uploadImageToCloudinary(file: File): Promise<{ originalImageUrl: string, tnImageUrl: string }> {

    const formData = new FormData();
    formData.append('image', file);

    try {
        // return await httpService.post<{ originalImageUrl: string, tnImageUrl: string }>('/api/cloudinary/upload', file)
        const {data} = await axios.post('/api/cloudinary/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data.images;
    } catch (error) {
        console.error(error)
        throw error
    }
}


import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

export const uploadImageToCloudinary = async (base64Image: string, folderName: string): Promise<string> => {
    configureCloudinary();

    try {
        const result: UploadApiResponse = await cloudinary.uploader.upload(base64Image, {
            folderName
        })
        return result.secure_url
    } catch (err) {
        console.log(err)
        throw new Error('Failed to upload image to Cloudinary')
    }
}

const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
}
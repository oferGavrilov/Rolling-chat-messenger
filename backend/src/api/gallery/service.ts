import { Gallery } from "src/models/gallery.model"
import { v2 as cloudinary } from 'cloudinary'
import { unlink } from "fs"


export async function getGalleryService(userId: string) {
    const gallery = await Gallery.find({ userId })
    // const gallery = await Gallery.find({ userId }).select('title url')

    return gallery
}

export async function createGalleryService(filePath: string, title: string, userId: string) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    console.log('Cloudinary config:', cloudinary.config());

    try {

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "image",
            public_id: `gallery/${title}_${Date.now()}`,
        })

        unlink(filePath, (err) => {
            if (err) {
                console.error(err)
            }
        })

        const gallery = new Gallery({ title, url: result.secure_url, userId })
        await gallery.save()
        return gallery
    } catch (error) {
        
        unlink(filePath, (err) => {
            if (err) {
                console.error(err)
            }
        })

        console.log(error)
    }
}
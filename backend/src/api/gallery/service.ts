import { Gallery } from "../../models/gallery.model.js"
import { v2 as cloudinary } from 'cloudinary'
import { unlink } from "fs"
import { NotFoundError } from "../../utils/errorHandler.js"


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

    console.log('Cloudinary config:', cloudinary.config())

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

export async function deleteGalleryService(id: string, userId: string) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    try {
        // Find the gallery item by ID and userId to ensure ownership
        const galleryItem = await Gallery.findOne({ _id: id, userId })

        if (!galleryItem) {
            throw new NotFoundError('Gallery item not found')
        }

        let publicId = galleryItem.url
            .split('/') 
            .pop() 
            .split('.')[0]
            .replace(/%20/g, ' ')

        publicId = `gallery/${publicId}`

        // Delete the image from Cloudinary
        const cloudinaryResult = await cloudinary.uploader.destroy(publicId, { resource_type: "image" })

        if (cloudinaryResult.result !== 'ok') {
            console.error('Cloudinary deletion failed:', cloudinaryResult)
            throw new Error('Cloudinary deletion failed')
        }
        // Delete the gallery item from the database
        await Gallery.deleteOne({ _id: id })

        return { message: 'Gallery item deleted' }
    } catch (error) {
        console.error('Deletion error:', error)
        throw error
    }
}

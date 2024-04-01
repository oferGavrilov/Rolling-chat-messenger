import { Gallery, IGallery } from "@/models/gallery.model"
import { v2 as cloudinary } from 'cloudinary'
import { unlink } from "fs"
import { NotFoundError } from "@/middleware/errorHandler"
import { ResponseStatus, ServiceResponse } from "@/models/serviceResponse"
import { StatusCodes } from "http-status-codes"
import { logger } from "@/server"


export async function getGalleryService(userId: string): Promise<ServiceResponse<IGallery[] | null>> {
    try {
        const gallery: IGallery[] = await Gallery.find({ userId })

        if (!gallery) {
            return new ServiceResponse(ResponseStatus.Failed, 'Gallery items not found', null, StatusCodes.NOT_FOUND)
        }
        // return gallery
        return new ServiceResponse(ResponseStatus.Success, 'Gallery items fetched', gallery, StatusCodes.OK)

    } catch (err) {
        const errorMessage = `Error fetching gallery items: ${(err as Error).message}`
        logger.error(errorMessage)
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function createGalleryService(filePath: string, title: string, userId: string): Promise<ServiceResponse<IGallery | null>> {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

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
        return new ServiceResponse(ResponseStatus.Success, 'Gallery item created', gallery, StatusCodes.CREATED)
    } catch (error) {

        unlink(filePath, (err) => {
            if (err) {
                console.error(err)
            }
        })
        const errorMessage = `Error creating gallery item: ${(error as Error).message}`
        logger.error(errorMessage)
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function deleteGalleryService(id: string, userId: string): Promise<ServiceResponse<{ message: string } | null>> {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    try {
        // Find the gallery item by ID and userId to ensure ownership
        const galleryItem = await Gallery.findOne({ _id: id, userId })

        if (!galleryItem || !galleryItem.url) {
            throw new NotFoundError('Gallery item not found')
        }

        let publicId = galleryItem?.url?.split('/')?.pop()?.split('.')[0]

        if (!publicId) {
            throw new NotFoundError('Public ID not found')
        }

        publicId = `gallery/${publicId}`

        // Delete the image from Cloudinary
        const cloudinaryResult = await cloudinary.uploader.destroy(publicId, { resource_type: "image" })

        if (cloudinaryResult.result !== 'ok') {
            console.error('Cloudinary deletion failed:', cloudinaryResult)
            throw new Error('Cloudinary deletion failed')
        }
        // Delete the gallery item from the database
        await Gallery.deleteOne({ _id: id })

        // return { message: 'Gallery item deleted' }
        return new ServiceResponse(ResponseStatus.Success, 'Gallery item deleted', { message: 'Gallery item deleted' }, StatusCodes.OK)
    } catch (error) {
        const errorMessage = `Error deleting gallery item: ${(error as Error).message}`
        logger.error(errorMessage)
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

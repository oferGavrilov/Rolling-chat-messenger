import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { cloudinaryConfig } from '@/utils/cloudinaryConfig'

cloudinary.config(cloudinaryConfig)

const uploadToCloudinaryAsPromise = (fileBuffer: Buffer, options: any): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) reject(error)
        else if (result) resolve(result)
        else reject(new Error('Failed to upload image to Cloudinary'))
      })
  
      uploadStream.end(fileBuffer)
    })
  }
  
  export const uploadImageToCloudinary = async (file: Express.Multer.File, folderName: string): Promise<{ originalImageUrl: string, tnImageUrl: string }> => {
    try {
      // Set the transformation options for the original image
      const uploadOptions = {
        folder: folderName,
        transformation: [
          { width: 1800, height: 1800, crop: "limit", quality: "auto:good", fetch_format: "auto" },
        ],
      }
  
      // Upload the original image
      const originalResult = await uploadToCloudinaryAsPromise(file.buffer, uploadOptions)
  
      if (!originalResult.public_id) {
        throw new Error('Failed to upload original image to Cloudinary.')
      }
  
      // Create a transformation for the tiny version of the image
      const tnTransformations = {
        transformation: [
          { width: originalResult.width, height: originalResult.height, crop: "limit", quality: 8, fetch_format: "auto" },
        ],
        public_id: `TN_${originalResult.public_id}`, // Public ID for the tiny version
      }
  
      // Upload the tiny version
      const tnResult = await uploadToCloudinaryAsPromise(file.buffer, { ...uploadOptions, ...tnTransformations })
  
      return {
        originalImageUrl: originalResult.secure_url,
        tnImageUrl: tnResult.secure_url || '',
      }
    } catch (err) {
      console.log(err)
      throw new Error('Failed to upload image to Cloudinary')
    }
  }


export const deleteImageFromCloudinary = async (imgUrl: string, folderName: string) => {
    try {
        let publicId = imgUrl
            ?.split('/')
            ?.pop()
            ?.split('.')[0]
            .replace(/%20/g, ' ')

        publicId = `${folderName}/${publicId}`

        if (publicId) {
            const result = await cloudinary.uploader.destroy(publicId)
            if (result.result !== 'ok') {
                console.error('Cloudinary deletion failed:', result)
            }
        }
    } catch (error) {
        console.error(error)
    }
}

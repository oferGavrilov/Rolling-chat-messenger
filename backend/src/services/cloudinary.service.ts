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

export const uploadPdfToCloudinary = async (file: Express.Multer.File, folderName: string): Promise<{ pdfUrl: string, previewUrl: string }> => {
  try {
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    // Upload the original PDF using the base64 encoded data
    const uploadResult = await cloudinary.uploader.upload(fileBase64, {
      resource_type: "auto",
      folder: folderName,
    });

    // Manually construct the preview URL
    const previewUrl = `https://res.cloudinary.com/${cloudinary.config().cloud_name}/image/upload/pg_1,w_600,h_600,c_fill,g_north,f_jpg,q_auto/${uploadResult.public_id}`;

    return {
      pdfUrl: uploadResult.secure_url, // URL to access the uploaded PDF
      previewUrl, // URL to access the JPG preview of the first page of the PDF
    };
  } catch (err) {
    console.error(err);
    throw new Error('Failed to upload PDF and generate preview');
  }
};


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

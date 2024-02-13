
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryRequest extends Request {
    file: Express.Multer.File
}

export const handleImageUploadToCloudinary = async (req: CloudinaryRequest, res: Response) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    try {
        if (!req.file) throw new Error("No file uploaded.");

        const result = cloudinary.uploader.upload_stream({ resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.status(500).send({ error: "Failed to upload image." });
                }

                if (result) {
                    res.status(200).json(result.secure_url);
                }
            });

        if (req.file.buffer) {
            result.end(req.file.buffer);
        } else {
            throw new Error("File buffer is not available.");
        }
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).send({ error: error.message });
    }
};

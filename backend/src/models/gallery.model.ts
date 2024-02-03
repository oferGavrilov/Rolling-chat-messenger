import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import mongoose, { Model, Schema } from "mongoose";
export interface IGallery {
    title: string
    url: string
    userId: ObjectId
}

export interface IGalleryDocument extends IGallery, Document {
    _id: ObjectId
}

export interface IGalleryRequest extends Request {
    body: {
        title: string
        userId: string
    }
    user: {
        _id: string
    }
    file: Express.Multer.File;
}

export interface IGalleryResponse extends Response {
    _id: string
    title: string
    url: string
    userId: string
}

const gallerySchema: Schema<IGalleryDocument> = new Schema<IGalleryDocument>({
    title: { type: String, required: true },
    url: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export const Gallery: Model<IGalleryDocument> = mongoose.model<IGalleryDocument>('Gallery', gallerySchema)

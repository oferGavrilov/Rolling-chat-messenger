import mongoose, { Document, Model } from 'mongoose'

export interface IMessage extends Document {
      sender: string
      content: string
      chat: string
      messageType: string
      TN_Image?: string // TODO: rename to thumbnailImage
      deletedBy: { userId: string, deletionType: 'forMe' | 'forEveryone' | 'forEveryoneAndMe' }[]
      isReadBy: { userId: string, readAt: Date }[]
      replyMessage: ReplyMessage | null
      messageSize?: number
      fileName?: string
      fileUrl?: string
}

const readReceiptSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      readAt: { type: Date, default: Date.now }
})

const deletedBySchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      deletionType: { type: String, enum: ['forMe', 'forEveryone', 'forEveryoneAndMe'] }
})

const messageModel = new mongoose.Schema({
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String, trim: true },
      TN_Image: { type: String, default: null },
      chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
      messageType: { type: String, enum: ['text', 'image', 'audio', 'file'], default: 'text' },
      replyMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
      messageSize: { type: Number, default: 0 },
      deletedBy: [deletedBySchema],
      isReadBy: [readReceiptSchema],
      fileName: { type: String, default: null },
      fileUrl: { type: String, default: null }
}, { timestamps: true })

export type ReplyMessage = {
      _id: string
      sender: {
            _id: string
            username: string
            profileImg: string
      }
      content: string
      messageType: "text" | "image" | "audio" | "file"
}

export type NewMessagePayload = {
      sender: string;
      content: string;
      chat: string;
      messageType: string;
      TN_Image?: string;
      replyMessage?: ReplyMessage | null; // Adjust according to your actual ReplyMessage type
      messageSize?: number;
      deletedBy?: { userId: string; deletionType: 'forMe' | 'forEveryone' | 'forEveryoneAndMe' }[];
      isReadBy?: { userId: string; readAt: Date }[];
      fileName?: string;
      fileUrl?: string;
    };

export const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageModel)

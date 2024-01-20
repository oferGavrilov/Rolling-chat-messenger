import { Request } from 'express'
import mongoose, { Document, Model } from 'mongoose'

const readReceiptSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      readAt: { type: Date, default: Date.now }
})

const messageModel = new mongoose.Schema({
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String, trim: true },
      chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
      messageType: { type: String, default: 'text' },
      replyMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
      messageSize: { type: Number, default: 0 },
      deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
      isReadBy: [readReceiptSchema]
}, { timestamps: true })

export interface RequestMessage extends Request {
      user?: {
            _id: string
      }
      chatId?: string;
      messageId?: string;
      content?: string;
      messageType?: string;
      replyMessage?: string;
      messageSize?: number;
}

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

export interface IMessage extends Document {
      sender: string
      content: string
      chat: string
      messageType: string
      deletedBy: string[]
      isReadBy: { userId: string, readAt: Date }[]
      messageSize?: number
      createdAt: Date
      updatedAt: Date
}


export const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageModel)

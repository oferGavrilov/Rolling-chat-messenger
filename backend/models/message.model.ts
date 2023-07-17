import { Request } from 'express'
import mongoose from 'mongoose'

export interface RequestMessage extends Request {
      user?: {
            _id: string;
      }
      body: {
            content: string;
            chatId: string;
      }
}

const messageModel = new mongoose.Schema({
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String, trim: true },
      chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
},
      { timestamps: true }
)

export const Message = mongoose.model('Message', messageModel)
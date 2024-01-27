import { Request } from 'express'
import mongoose, { Model, ObjectId, Schema, Types } from 'mongoose'
import { User } from './user.model.js'

export interface ChatDocument {
  _id?: ObjectId
  chatName: string
  isGroupChat: boolean
  users: Types.ObjectId[]
  latestMessage: Types.ObjectId
  isOnline?: boolean
  groupAdmin?: Types.ObjectId
  groupImage?: string
  deletedBy: DeletedBy[]
  kickedUsers?: KickedUsers[]
  lastSeen?: Date
  unreadMessages?: number
}

type DeletedBy = {
  userId: Types.ObjectId
  deletedAt: Date
}

type KickedUsers = {
  userId: Types.ObjectId
  kickedBy: Types.ObjectId
  kickedAt: Date
}

export interface RequestChat extends Request {
  body: {
    userId: string;
    currentUserId: string;
    users: User[];
    usersId: string[]
    chatName: string;
    groupImage: string;
    chatId: string;
    kickedByUserId: string;
    groupName: string;
    senderId: string;
  };
  user?: User;
  params: {
    userId?: string;
  };
}

const chatSchema: Schema<ChatDocument> = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    groupAdmin: { type: Schema.Types.ObjectId, ref: 'User' },
    groupImage: {
      type: String,
      default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    deletedBy: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      deletedAt: { type: Date, required: true },
    }],
    kickedUsers: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      kickedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      kickedAt: { type: Date, required: true },
    }],
  },
  { timestamps: true }
)

export const Chat: Model<ChatDocument> = mongoose.model<ChatDocument>('Chat', chatSchema)

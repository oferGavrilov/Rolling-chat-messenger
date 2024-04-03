import mongoose, { Model, ObjectId, Schema, Types } from 'mongoose'
import { DEFAULT_GUEST_IMAGE } from './user.model'

export interface IChat extends Document {
  _id: ObjectId
  chatName: string
  isGroupChat: boolean
  users: string[]
  latestMessage: Types.ObjectId | null
  groupAdmin?: string
  groupImage?: string
  deletedBy: DeletedBy[]
  kickedUsers: KickedUsers[]
  unreadMessages: number
}

type DeletedBy = {
  userId: Types.ObjectId
  deletedAt: Date
}
const DeletedBySchema = new Schema<DeletedBy>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deletedAt: { type: Date, required: true },
});

type KickedUsers = {
  userId: Types.ObjectId
  kickedBy: Types.ObjectId
  kickedAt: Date
}
const KickedUsersSchema = new Schema<KickedUsers>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  kickedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  kickedAt: { type: Date, required: true },
});

const chatSchema: Schema<IChat> = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    groupAdmin: { type: Schema.Types.ObjectId, ref: 'User' },
    groupImage: {
      type: String,
      default: DEFAULT_GUEST_IMAGE,
    },
    deletedBy: [DeletedBySchema],
    kickedUsers: [KickedUsersSchema],
  },
  { timestamps: true }
)

export const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema)

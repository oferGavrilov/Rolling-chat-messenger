import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ChatDocument extends Document {
  chatName?: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  latestMessage: Types.ObjectId;
  groupAdmin?: Types.ObjectId;
}

const chatSchema: Schema<ChatDocument> = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    groupAdmin: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Chat: Model<ChatDocument> = mongoose.model<ChatDocument>('Chat', chatSchema);

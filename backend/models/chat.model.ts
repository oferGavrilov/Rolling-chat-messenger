import mongoose from 'mongoose'

const chatModel = new mongoose.Schema({
      chatName: { type: String, trim: true },
      isGroupChat: { type: Boolean, default: false },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
      groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
      { timestamps: true }
)

export const Chat = mongoose.model('Chat', chatModel)
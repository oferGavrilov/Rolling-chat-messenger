import mongoose from 'mongoose';
const messageModel = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    messageType: { type: String, default: 'text' },
    messageSize: { type: Number, default: 0 }
}, { timestamps: true });
export const Message = mongoose.model('Message', messageModel);

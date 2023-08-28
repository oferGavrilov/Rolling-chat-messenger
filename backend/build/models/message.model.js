import mongoose from 'mongoose';
const messageModel = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    messageType: { type: String, default: 'text' },
    replyMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    messageSize: { type: Number, default: 0 },
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]
}, { timestamps: true });
export const Message = mongoose.model('Message', messageModel);
//# sourceMappingURL=message.model.js.map
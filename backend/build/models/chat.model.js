import mongoose, { Schema } from 'mongoose';
const chatSchema = new Schema({
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
}, { timestamps: true });
export const Chat = mongoose.model('Chat', chatSchema);
//# sourceMappingURL=chat.model.js.map
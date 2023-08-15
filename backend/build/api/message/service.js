var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Message } from "../../models/message.model";
import { Chat } from "../../models/chat.model";
import { handleErrorService } from "../../middleware/errorMiddleware";
export function sendMessageService(senderId, content, chatId, messageType, messageSize) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!content)
            throw new Error('No content passed into request');
        if (!chatId)
            throw new Error('No chatId passed into request');
        if (!messageType)
            throw new Error('No messageType passed into request');
        if (!senderId)
            throw new Error('No senderId passed into request');
        try {
            const newMessage = {
                sender: senderId,
                content,
                chat: chatId,
                messageType: messageType,
                messageSize: messageSize !== undefined ? messageSize : undefined
            };
            let message = yield Message.create(newMessage);
            message = (yield message.populate('sender', 'username profileImg'));
            message = (yield message.populate({ path: 'chat', populate: { path: 'users', select: '-password' } }));
            // Check if the other user ID is in the deletedBy array
            const chat = yield Chat.findById(chatId);
            const otherUserId = chat.users.find((user) => user.toString() !== senderId.toString());
            if (otherUserId && chat.deletedBy.includes(otherUserId.toString())) {
                // Remove the other user ID from the deletedBy array
                chat.deletedBy = chat.deletedBy.filter((userId) => userId.toString() !== otherUserId.toString());
                yield chat.save();
            }
            yield Chat.findByIdAndUpdate(chatId, { latestMessage: message });
            return message;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function getAllMessagesByChatId(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!chatId) {
            throw new Error('Invalid message data passed into request');
        }
        try {
            const messages = yield Message.find({ chat: chatId })
                .populate('sender', 'username profileImg')
                .populate('chat');
            return messages;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
//# sourceMappingURL=service.js.map
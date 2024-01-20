import { Message } from "../../models/message.model.js";
import { Chat } from "../../models/chat.model.js";
import { handleErrorService } from "../../middleware/errorMiddleware.js";
export async function sendMessageService(senderId, content, chatId, messageType, replyMessage, messageSize) {
    try {
        const newMessage = {
            sender: senderId,
            content,
            chat: chatId,
            messageType,
            replyMessage: replyMessage ? replyMessage : null,
            messageSize: messageSize ? messageSize : undefined,
        };
        let message = await Message.create(newMessage);
        message = (await message.populate('sender', 'username profileImg'));
        message = (await message.populate({ path: 'chat', populate: { path: 'users', select: '-password' } }));
        message = (await message.populate({
            path: 'replyMessage',
            select: '_id content sender',
            populate: {
                path: 'sender',
                select: '_id username profileImg'
            }
        }));
        // Check if the other user ID is in the deletedBy array
        const chat = await Chat.findById(chatId);
        const otherUserId = chat.users.find((user) => user.toString() !== senderId.toString());
        chat.deletedBy = [];
        await chat.save();
        if (otherUserId && chat.deletedBy.some(({ userId }) => userId.toString() === otherUserId.toString())) {
            // Remove the other user ID from the deletedBy array
            //chat.deletedBy = chat.deletedBy.filter(({ userId }) => userId.toString() !== otherUserId.toString())
            // await chat.save()
        }
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
        return message;
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function getAllMessagesByChatId(chatId, userId) {
    try {
        const messages = await Message.find({ chat: chatId, deletedBy: { $ne: userId } })
            .populate('sender', 'username profileImg')
            .populate({
            path: 'replyMessage',
            select: '_id content sender messageType',
            populate: {
                path: 'sender',
                select: '_id username profileImg'
            }
        });
        // update unread messages in chat
        messages.forEach((message) => {
            if (!message.isReadBy.some(({ userId: id }) => id.toString() === userId.toString())) {
                message.isReadBy.push({ userId, readAt: new Date() });
            }
        });
        await Promise.all(messages.map(async (message) => await message.save()));
        return messages;
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function removeMessageService(messageId, chatId, userId) {
    try {
        const chat = await Chat.findById(chatId);
        if (!chat)
            throw new Error('Chat not found');
        const message = await Message.findById(messageId);
        if (!message)
            throw new Error('Message not found');
        if (message.deletedBy.includes(userId))
            throw new Error('Message already deleted');
        message.deletedBy.push(userId);
        if (message.deletedBy.length === chat.users.length) {
            await Message.findByIdAndDelete(messageId);
        }
        else {
            await message.save();
        }
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function readMessagesService(messageIds, chatId, userId) {
    console.log(messageIds, chatId, userId);
    try {
        await Message.updateMany({ _id: { $in: messageIds }, chat: chatId }, { $addToSet: { isReadBy: { userId: userId, readAt: new Date() } } });
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
//# sourceMappingURL=service.js.map
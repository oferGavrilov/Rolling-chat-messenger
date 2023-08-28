import { getAllMessagesByChatId, removeMessageService, sendMessageService } from "./service.js";
import { handleErrorService } from "../../middleware/errorMiddleware.js";
export async function sendMessage(req, res) {
    const { content, chatId, messageType, replyMessage, messageSize } = req.body;
    const senderId = req.user?._id;
    if (!senderId)
        throw new Error('User not found');
    try {
        const message = await sendMessageService(senderId, content, chatId, messageType, replyMessage, messageSize);
        res.status(201).json(message);
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function getAllMessages(req, res) {
    const { chatId } = req.params;
    const userId = req.user?._id;
    try {
        const messages = await getAllMessagesByChatId(chatId, userId);
        res.status(200).json(messages);
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function deleteMessage(req, res) {
    const { messageId, chatId } = req.params;
    const userId = req.user?._id;
    try {
        await removeMessageService(messageId, chatId, userId);
        res.status(200).json({ message: 'message deleted' });
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
//# sourceMappingURL=controller.js.map
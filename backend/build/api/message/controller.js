import { getAllMessagesByChatId, sendMessageService, readMessagesService, removeMessageService } from "./service.js";
import { handleErrorService } from "../../middleware/errorMiddleware.js";
export async function getAllMessages(req, res) {
    const { chatId } = req.params;
    const userId = req.user?._id;
    if (!chatId)
        res.status(400).json({ message: 'ChatId is required' });
    try {
        const messages = await getAllMessagesByChatId(chatId, userId);
        res.status(200).json(messages || []);
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function sendMessage(req, res) {
    const { content, chatId, messageType, replyMessage, messageSize } = req.body;
    const senderId = req.user?._id;
    if (!content)
        res.status(400).json({ message: 'Content is required' });
    if (!chatId)
        res.status(400).json({ message: 'ChatId is required' });
    if (!messageType)
        res.status(400).json({ message: 'MessageType is required' });
    try {
        const message = await sendMessageService(senderId, content, chatId, messageType, replyMessage, messageSize);
        res.status(201).json(message);
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function deleteMessage(req, res) {
    const { messageId, chatId } = req.params;
    const userId = req.user?._id;
    if (!messageId)
        res.status(400).json({ message: 'MessageId is required' });
    if (!chatId)
        res.status(400).json({ message: 'ChatId is required' });
    try {
        await removeMessageService(messageId, chatId, userId);
        res.status(200).json({ message: 'message deleted' });
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function readMessages(req, res) {
    const { messageIds, chatId } = req.body;
    const userId = req.user?._id;
    if (!messageIds)
        res.status(400).json({ message: 'MessageIds is required' });
    if (!chatId)
        res.status(400).json({ message: 'ChatId is required' });
    try {
        await readMessagesService(messageIds, chatId, userId);
        res.status(200).json({ message: 'read status updated' });
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
//# sourceMappingURL=controller.js.map
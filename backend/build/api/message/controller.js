import { getAllMessagesByChatId, sendMessageService } from "./service.js";
import { handleErrorService } from "../../middleware/errorMiddleware.js";
export async function sendMessage(req, res) {
    const { content, chatId, messageType, messageSize } = req.body;
    const senderId = req.user?._id;
    if (!senderId)
        throw new Error('User not found');
    try {
        const message = await sendMessageService(senderId, content, chatId, messageType, messageSize);
        res.status(201).json(message);
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function getAllMessages(req, res) {
    const { chatId } = req.params;
    try {
        const messages = await getAllMessagesByChatId(chatId);
        res.status(200).json(messages);
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
//# sourceMappingURL=controller.js.map
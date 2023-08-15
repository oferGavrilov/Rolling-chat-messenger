var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAllMessagesByChatId, sendMessageService } from "./service.js";
import { handleErrorService } from "../../middleware/errorMiddleware.js";
export function sendMessage(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { content, chatId, messageType, messageSize } = req.body;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!senderId)
            throw new Error('User not found');
        try {
            const message = yield sendMessageService(senderId, content, chatId, messageType, messageSize);
            res.status(201).json(message);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function getAllMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { chatId } = req.params;
        try {
            const messages = yield getAllMessagesByChatId(chatId);
            res.status(200).json(messages);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
//# sourceMappingURL=controller.js.map
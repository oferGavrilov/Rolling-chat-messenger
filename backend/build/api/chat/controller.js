var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { updateUsersInGroupChatService, createChatService, createGroupChatService, getUserChatsService, removeFromGroupChatService, renameGroupChatService, updateGroupImageService, removeChatService } from './service.js';
import { handleErrorService } from '../../middleware/errorMiddleware.js';
export function createChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        const currentUser = req.user;
        try {
            const chat = yield createChatService(userId, currentUser);
            res.status(200).json(chat);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function getUserChats(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        if (!userId) {
            console.log('No user id sent to the server');
            return res.status(400).json({ message: 'No user id sent to the server' });
        }
        try {
            const result = yield getUserChatsService(req.user, userId);
            res.status(200).send(result);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function createGroupChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { users, chatName, groupImage } = req.body;
        const currentUser = req.user;
        if (!users)
            return res.status(400).json({ message: 'No users sent to the server' });
        if (!chatName)
            return res.status(400).json({ message: 'No chat name sent to the server' });
        try {
            const createdChat = yield createGroupChatService(users, chatName, groupImage, currentUser);
            res.status(200).send(createdChat);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function renameGroupChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { chatId, groupName } = req.body;
        if (!chatId)
            return res.status(400).json({ message: 'No chat id sent to the server' });
        if (!groupName)
            return res.status(400).json({ message: 'No group name sent to the server' });
        try {
            const updatedGroupName = yield renameGroupChatService(chatId, groupName);
            res.status(200).send(updatedGroupName);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function updateGroupImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { chatId, groupImage } = req.body;
        if (!chatId)
            return res.status(400).json({ message: 'No chat id sent to the server' });
        if (!groupImage)
            return res.status(400).json({ message: 'No group image sent to the server' });
        try {
            const updatedGroupImage = yield updateGroupImageService(chatId, groupImage);
            res.status(200).send(updatedGroupImage);
        }
        catch (error) {
            return handleErrorService(error);
        }
    });
}
export function updateUsersInGroupChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { chatId, users } = req.body;
        if (!users)
            return res.status(400).json({ message: 'No users sent to the server' });
        if (!chatId)
            return res.status(400).json({ message: 'No chat id sent to the server' });
        try {
            const updatedChat = yield updateUsersInGroupChatService(chatId, users);
            res.status(200).send(updatedChat);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function removeFromGroupChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { chatId, userId } = req.body;
        if (!userId)
            return res.status(400).json({ message: 'No user id sent to the server' });
        if (!chatId)
            return res.status(400).json({ message: 'No chat id sent to the server' });
        try {
            const removedChat = yield removeFromGroupChatService(chatId, userId);
            res.status(200).send(removedChat);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
// this function add the userId to the chat in the deletedBy key array
// if the deletedBy array length is equal to the number of users in the chat then the chat is deleted with all its messages
export function removeChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { chatId, userId } = req.body;
        try {
            const removedChat = yield removeChatService(chatId, userId);
            res.status(200).send(removedChat);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
//# sourceMappingURL=controller.js.map
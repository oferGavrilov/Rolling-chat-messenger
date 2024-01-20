import { updateUsersInGroupChatService, createChatService, createGroupChatService, getUserChatsService, renameGroupChatService, updateGroupImageService, removeChatService, kickFromGroupChatService, leaveGroupService } from './service.js';
import { handleErrorService } from '../../middleware/errorMiddleware.js';
import logger from '../../services/logger.service.js';
export async function createChat(req, res) {
    const { userId, currentUserId } = req.body;
    if (!userId)
        return res.status(400).json({ message: 'No user id sent to the server' });
    if (!currentUserId)
        return res.status(400).json({ message: 'No current user id sent to the server' });
    try {
        const chat = await createChatService(userId, currentUserId);
        logger.info(`[API: ${req.path}] - Chat with user: ${userId} created`);
        res.status(200).json(chat);
    }
    catch (error) {
        logger.error(`[API: ${req.path}] - Error while creating chat with user: ${userId}`);
        throw handleErrorService(error);
    }
}
export async function getUserChats(req, res) {
    const userId = req.user?._id;
    try {
        const result = await getUserChatsService(userId);
        logger.info(`[API: ${req.originalUrl}] - UserId: ${userId} chats fetched`);
        res.status(200).send(result || []);
    }
    catch (error) {
        logger.error(`[API: ${req.path}] - Error while fetching user: ${userId} chats`);
        throw handleErrorService(error);
    }
}
export async function createGroupChat(req, res) {
    const { users, chatName, groupImage } = req.body;
    const currentUser = req.user;
    if (!users)
        return res.status(400).json({ message: 'No users sent to the server' });
    if (!chatName)
        return res.status(400).json({ message: 'No chat name sent to the server' });
    try {
        const createdChat = await createGroupChatService(users, chatName, groupImage, currentUser);
        logger.info(`[API: ${req.path}] - Group chat: ${chatName} created`);
        res.status(200).send(createdChat);
    }
    catch (error) {
        logger.error(`Error while creating group chat: ${error.message}`);
        throw handleErrorService(error);
    }
}
export async function renameGroupChat(req, res) {
    const { chatId, groupName } = req.body;
    if (!chatId)
        return res.status(400).json({ message: 'No chat id sent to the server' });
    if (!groupName)
        return res.status(400).json({ message: 'No group name sent to the server' });
    try {
        const updatedGroupName = await renameGroupChatService(chatId, groupName);
        logger.info(`[API: ${req.path}] - Group name in chatId: ${chatId} updated to ${groupName}`);
        res.status(200).send(updatedGroupName);
    }
    catch (error) {
        logger.error(`[API: ${req.path}] - Error while updating group name in chatId: ${chatId}`);
        throw handleErrorService(error);
    }
}
export async function updateGroupImage(req, res) {
    const { chatId, groupImage } = req.body;
    if (!chatId)
        return res.status(400).json({ message: 'No chat id sent to the server' });
    if (!groupImage)
        return res.status(400).json({ message: 'No group image sent to the server' });
    try {
        const updatedGroupImage = await updateGroupImageService(chatId, groupImage);
        logger.info(`[API: ${req.path}] - Group image in chatId: ${chatId} updated`);
        res.status(200).send(updatedGroupImage);
    }
    catch (error) {
        logger.error(`[API: ${req.path}] - Error while updating group image in chatId: ${chatId}`);
        throw handleErrorService(error);
    }
}
export async function updateUsersInGroupChat(req, res) {
    const { chatId, users } = req.body;
    if (!users)
        return res.status(400).json({ message: 'No users sent to the server' });
    if (!chatId)
        return res.status(400).json({ message: 'No chat id sent to the server' });
    try {
        const updatedChat = await updateUsersInGroupChatService(chatId, users);
        logger.info(`[API: ${req.path}] - Users in chatId: ${chatId} updated`);
        res.status(200).send(updatedChat);
    }
    catch (error) {
        logger.error(`[API: ${req.path}] - Error while updating users in chatId: ${chatId}`);
        throw handleErrorService(error);
    }
}
export async function kickFromGroupChat(req, res) {
    const { chatId, userId, kickedByUserId } = req.body;
    if (!userId)
        return res.status(400).json({ message: 'No user id sent to the server' });
    if (!chatId)
        return res.status(400).json({ message: 'No chat id sent to the server' });
    try {
        const removedChat = await kickFromGroupChatService(chatId, userId, kickedByUserId);
        logger.info(`[API: ${req.path}] - User ${userId} kicked from chatId: ${chatId}`);
        res.status(200).send(removedChat);
    }
    catch (error) {
        logger.error(`[API: ${req.path}] - Error while kicking user: ${userId} from chatId: ${chatId}`);
        throw handleErrorService(error);
    }
}
export async function leaveGroup(req, res) {
    const { chatId, userId } = req.body;
    if (!userId)
        res.status(400).json({ message: 'No user id sent to the server' });
    if (!chatId)
        res.status(400).json({ message: 'No chat id sent to the server' });
    try {
        const removedChat = await leaveGroupService(chatId, userId);
        logger.info(`[API: ${req.path}] - User: ${userId} leaving chatId: ${chatId}`);
        res.status(200).send(removedChat);
    }
    catch (error) {
        logger.error(`[API: ${req.path}] - Error while user: ${userId} leaving chatId: ${chatId}`);
        throw handleErrorService(error);
    }
}
export async function removeChat(req, res) {
    const { chatId } = req.body;
    const userId = req.user?._id;
    if (!chatId)
        res.status(400).json({ message: 'No chat id sent to the server' });
    try {
        await removeChatService(chatId, userId);
        logger.info(`[API: ${req.path}] - ChatId: ${chatId} removed`);
        res.status(200).send({ message: 'Chat removed' });
    }
    catch (error) {
        logger.error(`[API: ${req.path}] - Error while removing chatId: ${chatId}`);
        throw handleErrorService(error);
    }
}
//# sourceMappingURL=controller.js.map
import { updateUsersInGroupChatService, createChatService, createGroupChatService, getUserChatsService, renameGroupChatService, updateGroupImageService, removeChatService, kickFromGroupChatService, leaveGroupService } from './service.js';
import { handleErrorService } from '../../middleware/errorMiddleware.js';
export async function createChat(req, res) {
    const { userId, currentUserId } = req.body;
    if (!userId)
        return res.status(400).json({ message: 'No user id sent to the server' });
    if (!currentUserId)
        return res.status(400).json({ message: 'No current user id sent to the server' });
    try {
        const chat = await createChatService(userId, currentUserId);
        res.status(200).json(chat);
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function getUserChats(req, res) {
    const userId = req.user?._id;
    try {
        const result = await getUserChatsService(userId);
        res.status(200).send(result || []);
    }
    catch (error) {
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
        res.status(200).send(createdChat);
    }
    catch (error) {
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
        console.log('updatedGroupName', updatedGroupName);
        res.status(200).send(updatedGroupName);
    }
    catch (error) {
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
        res.status(200).send(updatedGroupImage);
    }
    catch (error) {
        return handleErrorService(error);
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
        res.status(200).send(updatedChat);
    }
    catch (error) {
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
        res.status(200).send(removedChat);
    }
    catch (error) {
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
        res.status(200).send(removedChat);
    }
    catch (error) {
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
        res.status(200).send({ message: 'Chat removed' });
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
//# sourceMappingURL=controller.js.map
import { User } from "../../models/user.model.js";
import { Chat } from "../../models/chat.model.js";
import mongoose, { Types } from "mongoose";
import { handleErrorService } from "../../middleware/errorMiddleware.js";
import { Message } from "../../models/message.model.js";
export async function createChatService(receiverId, senderId) {
    console.log('createChatService', receiverId, senderId);
    if (!receiverId) {
        console.log('No user id sent to the server');
        throw new Error('No user id sent to the server');
    }
    const user = await User.findById(receiverId);
    if (!user) {
        console.log('User not found');
        throw new Error('User not found');
    }
    const isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: senderId } } },
            { users: { $elemMatch: { $eq: receiverId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");
    if (isChat.length > 0) {
        return isChat[0];
    }
    else {
        const chatData = {
            chatName: user.username,
            isGroupChat: false,
            users: [senderId, receiverId],
            latestMessage: undefined,
            deletedBy: [],
            isOnline: false,
            lastSeen: new Date(),
        };
        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', "-password");
            if (!fullChat) {
                throw new Error('Failed to retrieve the created chat');
            }
            return fullChat;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    }
}
export async function getUserChatsService(userId) {
    if (!userId) {
        throw new Error('No user id sent to the server');
    }
    const populateOptions = [
        { path: "users", select: "-password" },
        { path: "groupAdmin", select: "-password" },
        {
            path: "latestMessage",
            populate: { path: "sender", select: "username profileImg email" },
        },
    ];
    try {
        const userIdObject = new mongoose.Types.ObjectId(userId);
        const result = await Chat.find({
            $or: [
                { users: userIdObject },
                { "kickedUsers.userId": userIdObject },
            ]
        }).populate(populateOptions);
        // Filter out chats where the user's ID exists in the deletedBy array
        const filteredResult = result.filter(chat => !chat.deletedBy.some(deleted => deleted.userId.equals(userIdObject)));
        return filteredResult;
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function createGroupChatService(users, chatName, groupImage, currentUser) {
    if (!users || !chatName) {
        throw new Error('Please fill all the fields');
    }
    const usersIds = users.map((user) => user._id);
    const chatUsers = [...usersIds, currentUser._id];
    try {
        const groupChatData = {
            chatName,
            isGroupChat: true,
            users: chatUsers,
            latestMessage: undefined,
            deletedBy: [],
            kickedUsers: [],
            groupAdmin: currentUser._id,
            groupImage: groupImage || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
        };
        const createdChat = await Chat.create(groupChatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', "-password").populate('groupAdmin', "-password");
        if (!fullChat) {
            throw new Error('Failed to retrieve the created group chat');
        }
        return fullChat;
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function renameGroupChatService(chatId, groupName) {
    if (!chatId || !groupName) {
        throw new Error('Please fill all the fields');
    }
    try {
        await Chat.findByIdAndUpdate(chatId, { chatName: groupName }, { new: true, useFindAndModify: false }).populate('users', '-password').populate('groupAdmin', '-password');
        return groupName;
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function updateGroupImageService(chatId, groupImage) {
    if (!chatId || !groupImage) {
        return Promise.reject(new Error('Please fill all the fields'));
    }
    try {
        await Chat.findByIdAndUpdate(chatId, { groupImage }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password");
        return groupImage;
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function updateUsersInGroupChatService(chatId, users) {
    try {
        const usersIds = users.map((user) => user._id);
        await Chat.updateOne({ _id: chatId }, {
            $push: { users: { $each: usersIds } },
            $pull: {
                kickedUsers: { userId: { $in: usersIds } },
                deletedBy: { userId: { $in: usersIds } },
            },
        });
        const updated = await Chat.findById(chatId).populate('users', '-password').populate('groupAdmin', '-password');
        if (!updated) {
            throw new Error('Failed to retrieve updated chat');
        }
        return updated;
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function kickFromGroupChatService(chatId, userId, kickedByUserId) {
    if (!chatId || !userId || !kickedByUserId) {
        throw new Error('Please fill all the fields');
    }
    try {
        const kicked = await Chat.findByIdAndUpdate(chatId, {
            $addToSet: {
                kickedUsers: {
                    $each: [{ userId, kickedBy: kickedByUserId, kickedAt: new Date() }]
                }
            },
            $pull: {
                users: userId
            }
        }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password");
        if (!kicked) {
            throw new Error('Could not kick user');
        }
        return kicked;
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function leaveGroupService(chatId, userId) {
    if (!chatId || !userId) {
        throw new Error('Please fill all the fields');
    }
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        const isAdmin = chat.groupAdmin?.toString() === userId;
        let updatedChat;
        if (isAdmin && chat.users.length > 1) {
            // If the leaving user is an admin and there are other users in the chat
            const randomUserIndex = Math.floor(Math.random() * chat.users.length);
            const newAdminId = chat.users[randomUserIndex];
            updatedChat = await Chat.findByIdAndUpdate(chatId, {
                $pull: { users: userId },
                $set: { groupAdmin: newAdminId },
                $push: {
                    deletedBy: {
                        userId: userId,
                        deletedAt: new Date(),
                    },
                },
            }, { new: true });
        }
        else {
            // If the leaving user is not an admin or there's only one user left in the chat
            updatedChat = await Chat.findByIdAndUpdate(chatId, {
                $pull: { users: userId },
                $push: {
                    deletedBy: {
                        userId: userId,
                        deletedAt: new Date(),
                    },
                },
            }, { new: true });
        }
        if (!updatedChat) {
            throw new Error('Could not leave group');
        }
        return chatId;
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
export async function removeChatService(chatId, userId) {
    if (!chatId || !userId) {
        throw new Error('Please fill all the fields');
    }
    console.log('removeChatService', chatId, userId);
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        // check if the user is already in the deletedBy array
        if (chat.deletedBy.some((user) => user?.userId.toString() === userId)) {
            throw new Error('Chat already deleted');
        }
        chat.deletedBy.push({ userId: new Types.ObjectId(userId), deletedAt: new Date() });
        const allUsersDeleted = chat.users.every((user) => chat.deletedBy.some((deletedUser) => deletedUser.userId.toString() === user.toString()));
        // const allUsersDeleted = chat.users.every((user) => chat.deletedBy.includes(user.toString()))
        if (allUsersDeleted) {
            await Message.deleteMany({ chat: new Types.ObjectId(chatId) });
            const deleteResult = await Chat.deleteOne({ _id: new Types.ObjectId(chatId) });
            if (deleteResult.deletedCount !== 1) {
                console.log(`Chat with ID ${chatId} could not be deleted.`);
            }
        }
        else {
            await chat.save();
        }
        return chatId;
    }
    catch (error) {
        throw handleErrorService(error);
    }
}
//# sourceMappingURL=service.js.map
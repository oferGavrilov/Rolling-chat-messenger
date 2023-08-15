var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../../models/user.model.js";
import { Chat } from "../../models/chat.model.js";
import { Types } from "mongoose";
import { handleErrorService } from "../../middleware/errorMiddleware.js";
import { Message } from "../../models/message.model.js";
export function createChatService(userId, currentUser) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('createChatService', userId, currentUser);
        if (!userId) {
            console.log('No user id sent to the server');
            throw new Error('No user id sent to the server');
        }
        const user = yield User.findById(userId);
        if (!user) {
            console.log('User not found');
            throw new Error('User not found');
        }
        const isChat = yield Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: currentUser._id } } },
                { users: { $elemMatch: { $eq: userId } } },
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
                users: [currentUser._id, userId],
                isOnline: false,
                lastSeen: new Date(),
            };
            try {
                const createdChat = yield Chat.create(chatData);
                const fullChat = yield Chat.findOne({ _id: createdChat._id }).populate('users', "-password");
                if (!fullChat) {
                    throw new Error('Failed to retrieve the created chat');
                }
                return fullChat;
            }
            catch (error) {
                throw handleErrorService(error);
            }
        }
    });
}
export function getUserChatsService(user, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId || !user)
            return Promise.reject(new Error('Please fill all the fields'));
        const populateOptions = [
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
            {
                path: "latestMessage",
                populate: { path: "sender", select: "username profileImg email" },
            },
        ];
        try {
            const result = yield Chat.find({
                $and: [
                    { users: { $elemMatch: { $eq: user._id } } },
                    { users: { $elemMatch: { $eq: userId } } },
                    // Filter out chats where the user's ID exists in the deletedBy array
                    { deletedBy: { $nin: [user._id] } },
                ],
            }).populate(populateOptions);
            return result;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function createGroupChatService(users, chatName, groupImage, currentUser) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!users || !chatName) {
            throw new Error('Please fill all the fields');
        }
        users.push(currentUser._id);
        try {
            const groupChatData = {
                chatName,
                isGroupChat: true,
                users,
                groupAdmin: currentUser._id,
                groupImage: groupImage || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
            };
            const createdChat = yield Chat.create(groupChatData);
            const fullChat = yield Chat.findOne({ _id: createdChat._id }).populate('users', "-password").populate('groupAdmin', "-password");
            if (!fullChat) {
                throw new Error('Failed to retrieve the created group chat');
            }
            return fullChat;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function renameGroupChatService(chatId, groupName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!chatId || !groupName) {
            throw new Error('Please fill all the fields');
        }
        try {
            yield Chat.findByIdAndUpdate(chatId, { groupName }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password");
            return groupName;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function updateGroupImageService(chatId, groupImage) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!chatId || !groupImage) {
            return Promise.reject(new Error('Please fill all the fields'));
        }
        try {
            yield Chat.findByIdAndUpdate(chatId, { groupImage }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password");
            return groupImage;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function updateUsersInGroupChatService(chatId, users) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield Chat.findByIdAndUpdate(chatId, { users }, { new: true })
                .populate('users', "-password")
                .populate('groupAdmin', "-password");
            if (!updated) {
                throw new Error('Could not update users');
            }
            return updated;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function removeFromGroupChatService(chatId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!chatId || !userId) {
            throw new Error('Please fill all the fields');
        }
        try {
            const removed = yield Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
                .populate('users', "-password")
                .populate('groupAdmin', "-password");
            if (!removed) {
                throw new Error('Could not remove user');
            }
            return removed;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function removeChatService(chatId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!chatId || !userId) {
            throw new Error('Please fill all the fields');
        }
        try {
            const chat = yield Chat.findById(chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }
            if (chat.deletedBy.includes(userId)) {
                throw new Error('Chat already deleted');
            }
            chat.deletedBy.push(userId);
            const allUsersDeleted = chat.users.every((user) => chat.deletedBy.includes(user.toString()));
            if (allUsersDeleted) {
                yield Message.deleteMany({ chat: new Types.ObjectId(chatId) });
                const deleteResult = yield Chat.deleteOne({ _id: new Types.ObjectId(chatId) });
                if (deleteResult.deletedCount !== 1) {
                    console.log(`Chat with ID ${chatId} could not be deleted.`);
                }
            }
            else {
                yield chat.save();
            }
            return chatId;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
//# sourceMappingURL=service.js.map
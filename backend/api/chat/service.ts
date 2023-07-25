import { User } from "../../models/user.model"
import { Chat, type ChatDocument } from "../../models/chat.model"
import { Types, type PopulateOptions } from "mongoose"
import { handleErrorService } from "../../middleware/errorMiddleware"
import { Message } from "../../models/message.model"

export async function createChatService (userId: string, currentUser: User): Promise<ChatDocument> {
      console.log('createChatService' , userId, currentUser)
      if (!userId) {
            console.log('No user id sent to the server')
            throw new Error('No user id sent to the server')
      }

      const user = await User.findById(userId)

      if (!user) {
            console.log('User not found')
            throw new Error('User not found')
      }

      const isChat: ChatDocument[] = await Chat.find({
            isGroupChat: false,
            $and: [
                  { users: { $elemMatch: { $eq: currentUser._id } } },
                  { users: { $elemMatch: { $eq: userId } } },
            ],
      })
            .populate("users", "-password")
            .populate("latestMessage")

      if (isChat.length > 0) {
            return isChat[0] as ChatDocument
      } else {
            const chatData = {
                  chatName: user.username,
                  isGroupChat: false,
                  users: [currentUser._id, userId],
                  isOnline: false,
                  lastSeen: new Date(),
            }

            try {
                  const createdChat = await Chat.create(chatData)
                  const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', "-password")
                  if (!fullChat) {
                        throw new Error('Failed to retrieve the created chat')
                  }
                  return fullChat as ChatDocument
            } catch (error: any) {
                  throw handleErrorService(error)
            }
      }
}

export async function getUserChatsService (user: User, userId: string): Promise<ChatDocument[]> {
      if (!userId || !user) return Promise.reject(new Error('Please fill all the fields'))

      const populateOptions: PopulateOptions[] = [
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
            {
                  path: "latestMessage",
                  populate: { path: "sender", select: "username profileImg email" },
            },
      ]

      try {
            const result = await Chat.find({
                  $and: [
                        { users: { $elemMatch: { $eq: user._id } } },
                        { users: { $elemMatch: { $eq: userId } } },
                        // Filter out chats where the user's ID exists in the deletedBy array
                        { deletedBy: { $nin: [user._id] } },
                  ],
            }).populate(populateOptions);

            return result
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function createGroupChatService (users: string[], chatName: string, groupImage: string | undefined, currentUser: User): Promise<ChatDocument> {
      if (!users || !chatName) {
            throw new Error('Please fill all the fields')
      }

      users.push(currentUser._id)

      try {
            const groupChatData = {
                  chatName,
                  isGroupChat: true,
                  users,
                  groupAdmin: currentUser._id,
                  groupImage: groupImage || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
            }

            const createdChat = await Chat.create(groupChatData)
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', "-password").populate('groupAdmin', "-password")

            if (!fullChat) {
                  throw new Error('Failed to retrieve the created group chat')
            }

            return fullChat
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function renameGroupChatService (chatId: string, groupName: string): Promise<string> {
      if (!chatId || !groupName) {
            throw new Error('Please fill all the fields')
      }

      try {
            await Chat.findByIdAndUpdate(chatId, { groupName }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password")
            return groupName
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function updateGroupImageService (chatId: string, groupImage: string): Promise<string> {
      if (!chatId || !groupImage) {
            return Promise.reject(new Error('Please fill all the fields'));
      }

      try {
            await Chat.findByIdAndUpdate(chatId, { groupImage }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password")
            return groupImage
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function updateUsersInGroupChatService (chatId: string, users: string[]): Promise<ChatDocument> {
      try {
            const updated = await Chat.findByIdAndUpdate(chatId, { users }, { new: true })
                  .populate('users', "-password")
                  .populate('groupAdmin', "-password");

            if (!updated) {
                  throw new Error('Could not update users');
            }

            return updated;
      } catch (error: any) {
            throw handleErrorService(error);
      }
}

export async function removeFromGroupChatService (chatId: string, userId: string): Promise<ChatDocument> {
      if (!chatId || !userId) {
            throw new Error('Please fill all the fields')
      }

      try {
            const removed = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
                  .populate('users', "-password")
                  .populate('groupAdmin', "-password")

            if (!removed) {
                  throw new Error('Could not remove user')
            }

            return removed
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function removeChatService (chatId: string, userId: string): Promise<string> {
      if (!chatId || !userId) {
            throw new Error('Please fill all the fields');
      }

      try {
            const chat = await Chat.findById(chatId);

            if (!chat) {
                  throw new Error('Chat not found');
            }

            if (chat.deletedBy.includes(userId)) {
                  throw new Error('Chat already deleted');
            }

            chat.deletedBy.push(userId);

            const allUsersDeleted = chat.users.every((user) => chat.deletedBy.includes(user.toString()));

            if (allUsersDeleted) {
                  await Message.deleteMany({ chat: new Types.ObjectId(chatId) });
                  const deleteResult = await Chat.deleteOne({ _id: new Types.ObjectId(chatId) });

                  if (deleteResult.deletedCount !== 1) {
                        console.log(`Chat with ID ${chatId} could not be deleted.`);
                  }
            } else {
                  await chat.save();
            }

            return chatId;
      } catch (error: any) {
            throw handleErrorService(error);
      }
}
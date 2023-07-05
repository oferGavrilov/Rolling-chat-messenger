import { User } from "../../models/user.model"
import { Chat, ChatDocument } from "../../models/chat.model"
import { PopulateOptions } from "mongoose"

export async function createChatService (userId: string, currentUser: User): Promise<ChatDocument> {
      if (!userId) {
            console.log('No user id sent to the server')
            throw new Error('No user id sent to the server')
      }

      const user = await User.findById(userId)
      console.log('user', user)

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
            return isChat[0]
      } else {
            const chatData = {
                  chatName: user.username,
                  isGroupChat: false,
                  users: [currentUser._id, userId]
            }

            try {
                  const createdChat = await Chat.create(chatData)
                  const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', "-password")
                  return fullChat as ChatDocument
            } catch (error) {
                  throw new Error(error.message)
            }
      }
}

export async function getChatsService (user: User): Promise<ChatDocument[]> {
      const populateOptions: PopulateOptions[] = [
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
            { path: "latestMessage" },
            { path: "latestMessage.sender", select: "username profileImg email" },
      ];

      try {
            const chats = await Chat.find({ users: { $elemMatch: { $eq: user._id } } })
                  .populate(populateOptions)
                  .sort({ updatedAt: -1 });

            return chats;
      } catch (error) {
            throw new Error(error.message);
      }
}

export async function getUserChatsService (user: User, userId: string): Promise<ChatDocument[]> {
      const populateOptions: PopulateOptions[] = [
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
            {
                  path: "latestMessage",
                  populate: { path: "sender", select: "username profileImg email" },
            },
      ];

      try {
            const result = await Chat.find({
                  $and: [
                        { users: { $elemMatch: { $eq: user._id } } },
                        { users: { $elemMatch: { $eq: userId } } },
                  ],
            })
                  .populate(populateOptions);

            return result;
      } catch (error) {
            throw new Error(error.message);
      }
}

export async function createGroupChatService (users: string[], chatName: string, groupImage: string | undefined, currentUser: User): Promise<ChatDocument> {
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

            const createdChat = await Chat.create(groupChatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', "-password").populate('groupAdmin', "-password");

            return FullChat;
      } catch (error) {
            throw new Error(error.message);
      }
}

export async function renameGroupChatService (chatId: string, groupName: string): Promise<string> {
      if (!chatId || !groupName) {
            throw new Error('Please fill all the fields');
      }

      await Chat.findByIdAndUpdate(chatId, { groupName }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password");

      return groupName;
}

export async function updateGroupImageService (chatId: string, groupImage: string): Promise<string> {
      if (!chatId || !groupImage) {
            throw new Error('Please fill all the fields');
      }

      await Chat.findByIdAndUpdate(chatId, { groupImage }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password");

      return groupImage;
}

export async function addToGroupChatService (chatId: string, userId: string): Promise<ChatDocument> {
      if (!chatId || !userId) {
            throw new Error('Please fill all the fields');
      }

      const added = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password");

      if (!added) {
            throw new Error('Could not add user');
      }

      return added;
}

export async function removeFromGroupChatService (chatId: string, userId: string): Promise<ChatDocument> {
      if (!chatId || !userId) {
            throw new Error('Please fill all the fields');
      }

      const removed = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password");

      if (!removed) {
            throw new Error('Could not remove user');
      }

      return removed;
}

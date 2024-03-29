import { User } from "../../models/user.model.js"
import { Chat, type ChatDocument } from "../../models/chat.model.js"
import { Types } from "mongoose"
import { handleErrorService } from "../../middleware/errorMiddleware.js"
import { Message } from "../../models/message.model.js"

export async function createChatService(receiverId: string, senderId: string): Promise<ChatDocument> {

      const user = await User.findById(receiverId)

      if (!user) {
            throw new Error('User not found')
      }

      const isChat: ChatDocument[] = await Chat.find({
            isGroupChat: false,
            $and: [
                  { users: { $elemMatch: { $eq: senderId } } },
                  { users: { $elemMatch: { $eq: receiverId } } },
            ],
      })
            .populate("users", "-password")
            .populate("latestMessage")

      if (isChat.length > 0) {
            return isChat[0] as ChatDocument
      } else {
            const chatData: ChatDocument = {
                  chatName: user.username,
                  isGroupChat: false,
                  users: [new Types.ObjectId(senderId), new Types.ObjectId(receiverId)],
                  latestMessage: null,
                  deletedBy: []
            }

            try {
                  const createdChat = await Chat.create(chatData)
                  const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', "-password")
                  if (!fullChat) {
                        throw new Error('Failed to retrieve the created chat')
                  }
                  return fullChat as ChatDocument
            } catch (error: unknown) {
                  if (error instanceof Error) {
                        throw handleErrorService(error)
                  } else {
                        throw error
                  }
            }
      }
}

export async function getUserChatsService(userId: string): Promise<ChatDocument[]> {
      const populateOptions = [
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
            {
                  path: "latestMessage",
                  populate: { path: "sender", select: "username profileImg email" },
            },
      ];

      try {
            const chats = await Chat.find({
                  $or: [
                        { users: userId },
                        { "kickedUsers.userId": userId },
                  ],
                  $nor: [
                        { "deletedBy.userId": userId }
                  ]
            }).populate(populateOptions);

            // Add unread messages count for each chat
            const chatsWithUnreadCounts = await Promise.all(chats.map(async chat => {
                  const unreadMessagesCount = await Message.count({
                        chat: chat._id,
                        isReadBy: { $not: { $elemMatch: { userId: userId } } },
                        sender: { $ne: userId },
                        deletedBy: { $ne: userId }
                  });
                  return { ...chat.toObject(), unreadMessagesCount };
            }));

            return chatsWithUnreadCounts;
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

export async function removeChatService(chatId: string, userId: string): Promise<string> {
      try {
            const chat = await Chat.findById(chatId)

            if (!chat) {
                  throw new Error('Chat not found')
            }

            // check if the user is already in the deletedBy array
            if (chat.deletedBy.some((user) => user?.userId.toString() === userId)) {
                  throw new Error('Chat already deleted')
            }

            chat.deletedBy.push({ userId: new Types.ObjectId(userId), deletedAt: new Date() })
            await chat.save();

            // update the messages in the chat to be deleted by the user with the deletionType 'forMe'
            const messages = await Message.find({
                  chat: chatId,
                  deletedBy: {
                        $not: {
                              $elemMatch: { userId: userId, deletionType: 'forMe' }
                        }
                  }
            }).select('_id').lean();

            // Now that you have messages without a "forMe" deletion by this user, update them
            const messageIdsToUpdate = messages.map(message => message._id);

            if (messageIdsToUpdate.length > 0) {
                  await Message.updateMany(
                        { _id: { $in: messageIdsToUpdate } },
                        { $push: { deletedBy: { userId: new Types.ObjectId(userId), deletionType: 'forMe' } } }
                  );
            }

            return chatId
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

export async function createGroupChatService(users: User[], chatName: string, groupImage: string | undefined, currentUser: User): Promise<ChatDocument> {

      const usersIds = users.map((user) => user._id)

      const chatUsers = [...usersIds, currentUser._id]

      try {
            const groupChatData: ChatDocument = {
                  chatName,
                  isGroupChat: true,
                  users: chatUsers,
                  latestMessage: undefined,
                  deletedBy: [],
                  kickedUsers: [],
                  groupAdmin: currentUser._id,
                  groupImage: groupImage || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
            }

            const createdChat = await Chat.create(groupChatData)
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', "-password").populate('groupAdmin', "-password")

            if (!fullChat) {
                  throw new Error('Failed to retrieve the created group chat')
            }

            return fullChat
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

export async function renameGroupChatService(chatId: string, groupName: string): Promise<string> {

      try {
            await Chat.findByIdAndUpdate(
                  chatId,
                  { chatName: groupName },
                  { new: true, useFindAndModify: false }
            ).populate('users', '-password').populate('groupAdmin', '-password')

            return groupName
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

export async function updateGroupImageService(chatId: string, groupImage: string): Promise<string> {

      try {
            await Chat.findByIdAndUpdate(chatId, { groupImage }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password")
            return groupImage
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

export async function updateUsersInGroupChatService(chatId: string, users: User[]): Promise<ChatDocument> {
      try {
            const usersIds = users.map((user) => user._id)
            await Chat.updateOne(
                  { _id: chatId },
                  {
                        $push: { users: { $each: usersIds } },
                        $pull: {
                              kickedUsers: { userId: { $in: usersIds } },
                              deletedBy: { userId: { $in: usersIds } },
                        },
                  }
            )

            const updated = await Chat.findById(chatId).populate('users', '-password').populate('groupAdmin', '-password')

            if (!updated) {
                  throw new Error('Failed to retrieve updated chat')
            }

            return updated
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

export async function kickFromGroupChatService(chatId: string, userId: string, kickedByUserId: string): Promise<ChatDocument> {

      try {
            const kicked = await Chat.findByIdAndUpdate(
                  chatId,
                  {
                        $addToSet: {
                              kickedUsers: {
                                    $each: [{ userId, kickedBy: kickedByUserId, kickedAt: new Date() }]
                              }
                        },
                        $pull: {
                              users: userId
                        }
                  },
                  { new: true }
            ).populate('users', "-password").populate('groupAdmin', "-password")

            if (!kicked) {
                  throw new Error('Could not kick user')
            }

            return kicked
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

export async function leaveGroupService(chatId: string, userId: string): Promise<string> {

      try {
            const chat: ChatDocument | null = await Chat.findById(chatId)

            if (!chat) {
                  throw new Error('Chat not found')
            }

            const isAdmin = chat.groupAdmin?.toString() === userId

            let updatedChat: ChatDocument | null

            if (isAdmin && chat.users.length > 1) {
                  // If the leaving user is an admin and there are other users in the chat
                  const randomUserIndex = Math.floor(Math.random() * chat.users.length)
                  const newAdminId = chat.users[randomUserIndex]

                  updatedChat = await Chat.findByIdAndUpdate(
                        chatId,
                        {
                              $pull: { users: userId },
                              $set: { groupAdmin: newAdminId },
                              $push: {
                                    deletedBy: {
                                          userId: userId,
                                          deletedAt: new Date(),
                                    },
                              },
                        },
                        { new: true }
                  )
            } else {
                  // If the leaving user is not an admin or there's only one user left in the chat
                  updatedChat = await Chat.findByIdAndUpdate(
                        chatId,
                        {
                              $pull: { users: userId },
                              $push: {
                                    deletedBy: {
                                          userId: userId,
                                          deletedAt: new Date(),
                                    },
                              },
                        },
                        { new: true }
                  )
            }

            if (!updatedChat) {
                  throw new Error('Could not leave group')
            }

            return chatId
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

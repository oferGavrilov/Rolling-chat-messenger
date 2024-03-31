import { StatusCodes } from "http-status-codes"
import { IUser, User } from "@/models/user.model"
import { Chat, type IChat } from "@/models/chat.model"
import { Types } from "mongoose"
import { Message } from "@/models/message.model"
import { ResponseStatus, ServiceResponse } from "@/models/serviceResponse"
import { logger } from "@/server"

//TODO: Redefine this function 
export async function createChatService(receiverId: string, senderId: string): Promise<ServiceResponse<IChat | null>> {
      const user = await User.findById(receiverId)

      if (!user) {
            throw new Error('User not found')
      }

      const isChat: IChat[] = await Chat.find({
            isGroupChat: false,
            $and: [
                  { users: { $elemMatch: { $eq: senderId } } },
                  { users: { $elemMatch: { $eq: receiverId } } },
            ],
      })
            .populate("users", "-password")
            .populate("latestMessage")

      if (isChat.length > 0) {
            // return isChat[0] as ChatDocument
            return new ServiceResponse(ResponseStatus.Success, 'Chat found', isChat[0], StatusCodes.OK)
      } else {
            const chatData = {
                  chatName: user.username,
                  isGroupChat: false,
                  users: [senderId.toString(), receiverId.toString()],
                  latestMessage: null,
                  deletedBy: []
            }

            try {
                  const createdChat = await Chat.create(chatData)
                  const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', "-password")

                  if (!fullChat) {
                        throw new Error('Failed to retrieve the created chat')
                  }

                  return new ServiceResponse(ResponseStatus.Success, 'Chat created', fullChat, 200)

            } catch (error: unknown) {
                  const errorMessage = `Error creating chat: ${(error as Error).message}`
                  logger.error(errorMessage)
                  return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
            }
      }
}

export async function getUserChatsService(userId: string): Promise<ServiceResponse<IChat[] | null>> {
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

            return new ServiceResponse(ResponseStatus.Success, 'Chats fetched', chatsWithUnreadCounts, 200)
      } catch (error: unknown) {
            const errorMessage = `Error fetching chats: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function getChatByIdService(chatId: string): Promise<ServiceResponse<IChat | null>> {
      const populateOptions = [
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
            {
                  path: "latestMessage",
                  populate: { path: "sender", select: "username profileImg email" },
            },
      ]

      try {
            const chat = await Chat.findById(chatId).populate(populateOptions)

            if (!chat) {
                  // throw new Error('Chat not found')
                  return new ServiceResponse(ResponseStatus.Failed, 'Chat not found', null, 404)
            }

            // return chat
            return new ServiceResponse(ResponseStatus.Success, 'Chat found', chat, 200)
      } catch (error: unknown) {
            const errorMessage = `Error fetching chat: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function removeChatService(chatId: string, userId: string): Promise<ServiceResponse<string | null>> {
      try {
            const chat = await Chat.findById(chatId)

            if (!chat) {
                  return new ServiceResponse(ResponseStatus.Failed, 'Chat not found', null, 404)
            }

            // check if the user is already in the deletedBy array
            if (chat.deletedBy.some((user) => user?.userId.toString() === userId)) {
                  return new ServiceResponse(ResponseStatus.Failed, 'Chat already deleted', null, 400)
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

            return new ServiceResponse(ResponseStatus.Success, 'Chat removed', chatId, 200)
      } catch (error: unknown) {
            const errorMessage = `Error removing chat: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function createGroupChatService(users: IUser[], chatName: string, groupImage: string, currentUser: IUser): Promise<ServiceResponse<IChat | null>> {
      try {
            const usersIds = users.map((user) => user._id.toString())
            const chatUsers = [...usersIds, currentUser._id.toString()]

            const groupChatData = {
                  chatName,
                  isGroupChat: true,
                  users: chatUsers,
                  latestMessage: null,
                  deletedBy: [],
                  kickedUsers: [],
                  groupAdmin: currentUser._id,
                  groupImage: groupImage,
            }

            const createdChat = await Chat.create(groupChatData)
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', "-password").populate('groupAdmin', "-password")

            if (!fullChat) {
                  return new ServiceResponse(ResponseStatus.Failed, 'Failed to retrieve the created group chat', null, StatusCodes.INTERNAL_SERVER_ERROR)
            }

            return new ServiceResponse(ResponseStatus.Success, 'Group chat created', fullChat, 200)
      } catch (error: unknown) {
            const errorMessage = `Error creating group chat: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function renameGroupChatService(chatId: string, groupName: string): Promise<ServiceResponse<string | null>> {
      try {
            await Chat.findByIdAndUpdate(
                  chatId,
                  { chatName: groupName },
                  { new: true, useFindAndModify: false }
            ).populate('users', '-password').populate('groupAdmin', '-password')

            // return groupName
            return new ServiceResponse(ResponseStatus.Success, 'Group chat renamed', groupName, 200)
      } catch (error: unknown) {
            const errorMessage = `Error renaming group chat: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function updateGroupImageService(chatId: string, groupImage: string): Promise<ServiceResponse<string | null>> {
      try {
            await Chat.findByIdAndUpdate(chatId, { groupImage }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password")
            return new ServiceResponse(ResponseStatus.Success, 'Group image updated', groupImage, 200)
      } catch (error: unknown) {
            const errorMessage = `Error updating group image: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function updateUsersInGroupChatService(chatId: string, users: IUser[]): Promise<ServiceResponse<IChat | null>> {
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

            return new ServiceResponse(ResponseStatus.Success, 'Users in group chat updated', updated, 200)
      } catch (error: unknown) {
            const errorMessage = `Error updating users in group chat: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function kickFromGroupChatService(chatId: string, userId: string, kickedByUserId: string): Promise<ServiceResponse<IChat | null>> {
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

            return new ServiceResponse(ResponseStatus.Success, 'User kicked from group chat', kicked, 200)
      } catch (error: unknown) {
            const errorMessage = `Error kicking user from group chat: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function leaveGroupService(chatId: string, userId: string): Promise<ServiceResponse<string | null>> {
      try {
            const chat: IChat | null = await Chat.findById(chatId)

            if (!chat) {
                  throw new Error('Chat not found')
            }

            const isAdmin = chat.groupAdmin?.toString() === userId

            let updatedChat: IChat | null

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

            return new ServiceResponse(ResponseStatus.Success, 'User left group chat', chatId, 200)
      } catch (error: unknown) {
            const errorMessage = `Error leaving group chat: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

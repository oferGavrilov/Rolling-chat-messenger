import { User } from "../../models/user.model.js"
import { Chat, type ChatDocument } from "../../models/chat.model.js"
import mongoose, { Types, type PopulateOptions, ObjectId } from "mongoose"
import { handleErrorService } from "../../middleware/errorMiddleware.js"
import { Message } from "../../models/message.model.js"


export async function createChatService (receiverId: string, senderId: string): Promise<ChatDocument> {
      console.log('createChatService', receiverId, senderId)
      if (!receiverId) {
            console.log('No user id sent to the server')
            throw new Error('No user id sent to the server')
      }

      const user = await User.findById(receiverId)

      if (!user) {
            console.log('User not found')
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
                  users: [senderId, receiverId] as any,
                  latestMessage: undefined,
                  deletedBy: [],
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

export async function getUserChatsService (userId: string): Promise<ChatDocument[]> {
      if (!userId) return Promise.reject(new Error('No user id sent to the server'))

      console.log('getUserChatsService', userId)

      const populateOptions: PopulateOptions[] = [
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
            {
                  path: "latestMessage",
                  populate: { path: "sender", select: "username profileImg email" },
            },
      ]

      try {
            const userIdObject = new mongoose.Types.ObjectId(userId)

            // Get chats where the user is in the users array or the user is in the kickedUsers array
            const result = await Chat.find({
                  $and: [
                        {
                              $or: [
                                    { users: { $elemMatch: { $eq: userIdObject } } },
                                    { "kickedUsers.userId": userIdObject },
                              ],
                        },
                        { deletedBy: { $nin: [userIdObject] } },
                  ],
            }).populate(populateOptions)

            return result
      } catch (error: any) {
            throw handleErrorService(error)
      }
}


export async function createGroupChatService (users: User[], chatName: string, groupImage: string | undefined, currentUser: User): Promise<ChatDocument> {
      if (!users || !chatName) {
            throw new Error('Please fill all the fields')
      }

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
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function renameGroupChatService (chatId: string, groupName: string): Promise<string> {
      if (!chatId || !groupName) {
            throw new Error('Please fill all the fields')
      }

      try {
            await Chat.findByIdAndUpdate(
                  chatId,
                  { chatName: groupName },
                  { new: true, useFindAndModify: false }
            ).populate('users', '-password').populate('groupAdmin', '-password')

            return groupName
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function updateGroupImageService (chatId: string, groupImage: string): Promise<string> {
      if (!chatId || !groupImage) {
            return Promise.reject(new Error('Please fill all the fields'))
      }

      try {
            await Chat.findByIdAndUpdate(chatId, { groupImage }, { new: true }).populate('users', "-password").populate('groupAdmin', "-password")
            return groupImage
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function updateUsersInGroupChatService (chatId: string, users: User[]): Promise<ChatDocument> {
      console.log('users to update', users)
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
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function kickFromGroupChatService (chatId: string, userId: string, kickedByUserId: string): Promise<ChatDocument> {
      if (!chatId || !userId || !kickedByUserId) {
            throw new Error('Please fill all the fields')
      }

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
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function leaveGroupService (chatId: string, userId: string): Promise<string> {
      if (!chatId || !userId) {
            throw new Error('Please fill all the fields')
      }


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
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function removeChatService (chatId: string, userId: string): Promise<string> {
      if (!chatId || !userId) {
            throw new Error('Please fill all the fields')
      }

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

            const allUsersDeleted = chat.users.every((user) => chat.deletedBy.some((deletedUser) => deletedUser.userId.toString() === user.toString()))
            // const allUsersDeleted = chat.users.every((user) => chat.deletedBy.includes(user.toString()))

            if (allUsersDeleted) {
                  await Message.deleteMany({ chat: new Types.ObjectId(chatId) })
                  const deleteResult = await Chat.deleteOne({ _id: new Types.ObjectId(chatId) })

                  if (deleteResult.deletedCount !== 1) {
                        console.log(`Chat with ID ${chatId} could not be deleted.`)
                  }
            } else {
                  await chat.save()
            }

            return chatId
      } catch (error: any) {
            throw handleErrorService(error)
      }
}
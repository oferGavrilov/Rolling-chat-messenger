import { type Request, type Response } from 'express'
import { updateUsersInGroupChatService, createChatService, createGroupChatService, getUserChatsService, renameGroupChatService, updateGroupImageService, removeChatService, kickFromGroupChatService, leaveGroupService, getChatByIdService } from './service'
import type { IUser } from '@/models/user.model'
import { handleServiceResponse } from '@/utils/httpHandler'
import { uploadImageToCloudinary } from '@/services/cloudinary.service'

export async function createChat(req: Request, res: Response) {
      const { userId } = req.body
      const currentUserId = req.user?._id

      if (!userId) return res.status(400).json({ message: 'No user id sent to the server' })
      if (!currentUserId) return res.status(400).json({ message: 'No current user id sent to the server' })

      const chat = await createChatService(userId, currentUserId)
      handleServiceResponse(chat, res)
}

export async function getUserChats(req: Request, res: Response) {
      const userId = req.user?._id

      if (!userId) return res.status(400).json({ message: 'No user id sent to the server' })

      const serviceResponse = await getUserChatsService(userId)
      handleServiceResponse(serviceResponse, res)
}

export async function getChatById(req: Request, res: Response) {
      const chatId = req.params.chatId
      if (!chatId) return res.status(400).json({ message: 'No chat id sent to the server' })

      const chat = await getChatByIdService(chatId)
      handleServiceResponse(chat, res)
}

export async function createGroupChat(req: Request, res: Response) {
      const { users, chatName, groupImage = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' } = req.body
      const currentUser = req.user as IUser

      if (!users) return res.status(400).json({ message: 'No users sent to the server' })
      if (!chatName) return res.status(400).json({ message: 'No chat name sent to the server' })

      const createdChat = await createGroupChatService(users, chatName, groupImage, currentUser)
      handleServiceResponse(createdChat, res)
}

export async function renameGroupChat(req: Request, res: Response) {
      const { chatId, groupName } = req.body

      if (!chatId) return res.status(400).json({ message: 'No chat id sent to the server' })
      if (!groupName) return res.status(400).json({ message: 'No group name sent to the server' })

      const updatedGroupName = await renameGroupChatService(chatId, groupName)
      handleServiceResponse(updatedGroupName, res)
}

export async function updateGroupImage(req: Request, res: Response) {
      const { chatId } = req.body
      const reqGroupImage = req.file

      if (!chatId) return res.status(400).json({ message: 'No chat id sent to the server' })
      if (!reqGroupImage) return res.status(400).json({ message: 'No group image sent to the server' })

      let groupImageToSave: string = ''

      const result = await uploadImageToCloudinary(reqGroupImage, 'profiles')
      groupImageToSave = result.originalImageUrl

      const updatedGroupImage = await updateGroupImageService(chatId, groupImageToSave)
      handleServiceResponse(updatedGroupImage, res)
}

export async function updateUsersInGroupChat(req: Request, res: Response) {
      const { chatId, users } = req.body

      if (!users) return res.status(400).json({ message: 'No users sent to the server' })
      if (!chatId) return res.status(400).json({ message: 'No chat id sent to the server' })

      const updatedChat = await updateUsersInGroupChatService(chatId, users)
      handleServiceResponse(updatedChat, res)
}

export async function kickFromGroupChat(req: Request, res: Response) {
      const { chatId, kickedByUserId } = req.body
      const userId = req.user?._id

      if (!chatId) return res.status(400).json({ message: 'No chat id sent to the server' })

      const removedChat = await kickFromGroupChatService(chatId, userId, kickedByUserId)
      handleServiceResponse(removedChat, res)
}

export async function leaveGroup(req: Request, res: Response) {
      const { chatId } = req.body
      const userId = req.user?._id

      if (!chatId) res.status(400).json({ message: 'No chat id sent to the server' })

      const removedChat = await leaveGroupService(chatId, userId)
      handleServiceResponse(removedChat, res)
}

export async function removeChat(req: Request, res: Response) {
      const { chatId } = req.body
      const userId = req.user?._id

      if (!chatId) res.status(400).json({ message: 'No chat id sent to the server' })
      if (chatId === 'temp-id') return res.status(200).send({ message: 'Chat removed' })

      const serviceResponse = await removeChatService(chatId, userId)
      handleServiceResponse(serviceResponse, res)
}

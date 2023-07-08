
import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../models/types'
import type { User } from '../../models/user.model'
import { addToGroupChatService, createChatService, createGroupChatService, getChatsService, getUserChatsService, removeFromGroupChatService, renameGroupChatService, updateGroupImageService } from './service'
import { handleErrorService } from '../../middleware/errorMiddleware'

export async function createChat (req: AuthenticatedRequest, res: Response) {
      const { userId } = req.body
      const currentUser = req.user as User

      try {
            const chat = await createChatService(userId, currentUser)
            res.status(200).json(chat)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function getChats (req: AuthenticatedRequest, res: Response) {
      try {
            const chats = await getChatsService(req.user as User)
            res.status(200).send(chats)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function getUserChats (req: AuthenticatedRequest, res: Response) {
      const { userId } = req.params
      console.log('userId', userId)

      if (!userId) {
            console.log('No user id sent to the server')
            return res.status(400).json({ message: 'No user id sent to the server' })
      }

      try {
            const result = await getUserChatsService(req.user as User, userId)
            res.status(200).send(result)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}


export async function createGroupChat (req: AuthenticatedRequest, res: Response) {
      const { users, chatName, groupImage } = req.body
      const currentUser = req.user as User

      try {
            const createdChat = await createGroupChatService(users, chatName, groupImage, currentUser)
            res.status(200).send(createdChat)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function renameGroupChat (req: AuthenticatedRequest, res: Response) {
      const { chatId, groupName } = req.body

      try {
            const updatedGroupName = await renameGroupChatService(chatId, groupName)
            res.status(200).send(updatedGroupName)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function updateGroupImage (req: AuthenticatedRequest, res: Response) {
      const { chatId, groupImage } = req.body

      try {
            const updatedGroupImage = await updateGroupImageService(chatId, groupImage)
            res.status(200).send(updatedGroupImage)
      } catch (error: any) {
            return handleErrorService(error)
      }
}

export async function addToGroupChat (req: AuthenticatedRequest, res: Response) {
      const { chatId, userId } = req.body

      try {
            const addedChat = await addToGroupChatService(chatId, userId)
            res.status(200).send(addedChat)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function removeFromGroupChat (req: AuthenticatedRequest, res: Response) {
      const { chatId, userId } = req.body

      try {
            const removedChat = await removeFromGroupChatService(chatId, userId)
            res.status(200).send(removedChat)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

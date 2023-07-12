
import type { Response , Request} from 'express'
import type { User } from '../../models/user.model'
import { updateUsersInGroupChatService, createChatService, createGroupChatService, getChatsService, getUserChatsService, removeFromGroupChatService, renameGroupChatService, updateGroupImageService, removeChatService } from './service'
import { handleErrorService } from '../../middleware/errorMiddleware'
import { AuthenticatedRequest, RequestWithUser } from '../../models/types'

export async function createChat (req: AuthenticatedRequest, res: Response) {
      const { userId } = req.body
      const currentUser = req.user as User

      try {
            const chat = await createChatService(userId, currentUser)
            console.log('chat', chat)
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

export async function createGroupChat (req: RequestWithUser, res: Response) {
      const { users, chatName, groupImage } = req.body
      const currentUser = req.user as User

      if (!users) return res.status(400).json({ message: 'No users sent to the server' })
      if (!chatName) return res.status(400).json({ message: 'No chat name sent to the server' })

      try {
            const createdChat = await createGroupChatService(users, chatName, groupImage, currentUser)
            res.status(200).send(createdChat)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function renameGroupChat (req: Request, res: Response) {
      const { chatId, groupName } = req.body

      if (!chatId) return res.status(400).json({ message: 'No chat id sent to the server' })
      if (!groupName) return res.status(400).json({ message: 'No group name sent to the server' })

      try {
            const updatedGroupName = await renameGroupChatService(chatId, groupName)
            res.status(200).send(updatedGroupName)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function updateGroupImage (req: Request, res: Response) {
      const { chatId, groupImage } = req.body

      if (!chatId) return res.status(400).json({ message: 'No chat id sent to the server' })
      if (!groupImage) return res.status(400).json({ message: 'No group image sent to the server' })

      try {
            const updatedGroupImage = await updateGroupImageService(chatId, groupImage)
            res.status(200).send(updatedGroupImage)
      } catch (error: any) {
            return handleErrorService(error)
      }
}

export async function updateUsersInGroupChat (req: Request, res: Response) {
      const { chatId, users } = req.body

      if (!users) return res.status(400).json({ message: 'No users sent to the server' })
      if (!chatId) return res.status(400).json({ message: 'No chat id sent to the server' })

      try {
            const updatedChat = await updateUsersInGroupChatService(chatId, users)
            res.status(200).send(updatedChat)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function removeFromGroupChat (req: Request, res: Response) {
      const { chatId, userId } = req.body
      
      if (!userId) return res.status(400).json({ message: 'No user id sent to the server' })
      if (!chatId) return res.status(400).json({ message: 'No chat id sent to the server' })

      try {
            const removedChat = await removeFromGroupChatService(chatId, userId)
            res.status(200).send(removedChat)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

// this function add the userId to the chat in the deletedBy key array
// if the deletedBy array length is equal to the number of users in the chat then the chat is deleted with all its messages
export async function removeChat (req: Request, res: Response) {
      const { chatId, userId } = req.body

      try {
            const removedChat = await removeChatService(chatId, userId)
            res.status(200).send(removedChat)
      } catch (error: any) {
            throw handleErrorService(error)
      }

}
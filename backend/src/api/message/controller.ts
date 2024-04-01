import { type Request, type Response } from "express"
import { getAllMessagesByChatId, sendMessageService, removeMessageService } from "./service"
import { logger } from "@/server"
import { handleServiceResponse } from "@/utils/httpHandler"

export async function sendMessage(req: Request, res: Response) {
      const file = req.file
      const senderId = req.user?._id

      const content = req.body?.content ?? ''
      const chatId = req.body?.chatId
      const messageType = req.body?.messageType
      const messageSize = req.body?.messageSize ? parseInt(req.body.messageSize, 10) : undefined
      const replyMessage = req.body?.replyMessage ? JSON.parse(req.body.replyMessage) : null

      if (!messageType) return res.status(400).json({ message: 'Message type is required' })
      if (messageType === 'text' && !content?.trim()) return res.status(400).json({ message: 'Content cannot be empty' })
      if (messageType === 'text' && content.length > 700) return res.status(400).json({ message: 'Text message cannot be more than 700 characters' })
      if (messageType === 'image' && !file) return res.status(400).json({ message: 'File not found' })
      if (!chatId) return res.status(400).json({ message: 'ChatId is required' })
      if (!senderId) return res.status(401).json({ message: 'Unauthorized' })

      const message = await sendMessageService(senderId, content, chatId, messageType, replyMessage, messageSize, file)
      handleServiceResponse(message, res)
}

export async function getAllMessages(req: Request, res: Response) {
      const { chatId } = req.params
      const userId = req.user._id

      if (!chatId) {
            return res.status(400).json({ message: 'ChatId is required' })
      }

      const response = await getAllMessagesByChatId(chatId, userId)
      handleServiceResponse(response, res)
}

export async function removeMessage(req: Request, res: Response) {
      const { messageId, chatId } = req.params
      const { deletionType } = req.body ?? {}
      const userId = req.user?._id

      if (!messageId || !chatId || !deletionType) {
            logger.error('MessageId or ChatId or deletionType are missing in removeMessage controller', { messageId, chatId, deletionType })
            return res.status(400).json({ message: 'Something went wrong, please try again later' })
      }

      if (messageId === 'temp-id') { // If the message is not yet saved in the database
            return res.status(200).json({ message: 'Message deleted' })
      }

      //  await removeMessageService(messageId, chatId, userId, deletionType)
      // return res.status(200).json({ message: 'Message deleted' })
      const response = await removeMessageService(messageId, chatId, userId, deletionType)
      handleServiceResponse(response, res)
}

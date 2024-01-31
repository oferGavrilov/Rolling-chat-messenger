import { Response, NextFunction } from "express"
import { getAllMessagesByChatId, sendMessageService, removeMessageService } from "./service.js"
import { RequestMessage } from "../../models/message.model.js"
import { ForbiddenError, NotFoundError } from "src/utils/errorHandler.js"

export async function sendMessage(req: RequestMessage, res: Response, next: NextFunction) {
      const { content, chatId, messageType, replyMessage, messageSize } = req.body
      const senderId = req.user?._id

      if (!content || !chatId || !messageType) {
            return res.status(400).json({ message: 'Content, ChatId, and MessageType are required' })
      }

      try {
            const message = await sendMessageService(senderId, content, chatId, messageType, replyMessage, messageSize)
            return res.status(201).json(message)
      } catch (error) {
            if (error instanceof ForbiddenError || error instanceof NotFoundError) {
                  return res.status(error.statusCode).json({ message: error.message });
            } else {
                  next(error);
            }
      }
}

export async function getAllMessages(req: RequestMessage, res: Response, next: NextFunction) {
      const { chatId } = req.params
      const userId = req.user?._id

      if (!chatId) {
            return res.status(400).json({ message: 'ChatId is required' })
      }

      try {
            const messages = await getAllMessagesByChatId(chatId, userId)
            return res.status(200).json(messages || [])
      } catch (error) {
            if (error instanceof ForbiddenError || error instanceof NotFoundError) {
                  return res.status(error.statusCode).json({ message: error.message });
            } else {
                  next(error);
            }
      }
}

export async function removeMessage(req: RequestMessage, res: Response, next: NextFunction) {
      const { messageId, chatId } = req.params
      const userId = req.user?._id

      if (!messageId || !chatId) {
            return res.status(400).json({ message: 'MessageId and ChatId are required' })
      }

      try {
            await removeMessageService(messageId, chatId, userId)
            return res.status(200).json({ message: 'Message deleted' })
      } catch (error) {
            if (error instanceof ForbiddenError || error instanceof NotFoundError) {
                  return res.status(error.statusCode).json({ message: error.message });
            } else {
                  next(error);
            }
      }
}

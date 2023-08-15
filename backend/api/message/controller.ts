import type { Response, Request } from "express"

import { getAllMessagesByChatId, sendMessageService } from "./service.js"
import { handleErrorService } from "../../middleware/errorMiddleware.js"
import { RequestMessage } from "../../models/message.model.js"

export async function sendMessage (req: RequestMessage, res: Response) {
      const { content, chatId, messageType, messageSize } = req.body
      const senderId = req.user?._id

      if (!senderId) throw new Error('User not found')

      try {
            const message = await sendMessageService(senderId, content, chatId, messageType, messageSize)
            res.status(201).json(message)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function getAllMessages (req: Request, res: Response) {
      const { chatId } = req.params

      try {
            const messages = await getAllMessagesByChatId(chatId)
            res.status(200).json(messages)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}
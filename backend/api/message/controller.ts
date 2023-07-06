import type { AuthenticatedRequest } from "../../models/types"
import type { Response } from "express"

import { getAllMessagesByChatId, sendMessageService } from "./service"
import { handleErrorService } from "../../middleware/errorMiddleware"

export async function sendMessage (req: AuthenticatedRequest, res: Response) {
      const { content, chatId } = req.body
      const senderId = req.user?._id

      try {
            const message = await sendMessageService(senderId, content, chatId)
            res.status(201).json(message)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function getAllMessages (req: AuthenticatedRequest, res: Response) {
      const { chatId } = req.params

      try {
            const messages = await getAllMessagesByChatId(chatId)
            res.status(200).json(messages)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}
import { AuthenticatedRequest } from "../../models/types"
import { Response } from "express"

import { getAllMessagesByChatId, sendMessageService } from "./service"

export async function sendMessage (req: AuthenticatedRequest, res: Response) {
      const { content, chatId } = req.body
      const senderId = req.user?._id

      try {
            const message = await sendMessageService(senderId, content, chatId)
            res.status(201).json(message)
      } catch (error) {
            console.error('Error sending message:', error)
            return res.status(400).json({ msg: 'Invalid message data passed into request' })
      }
}

export async function getAllMessages (req: AuthenticatedRequest, res: Response) {
      const { chatId } = req.params

      try {
            const messages = await getAllMessagesByChatId(chatId)
            res.status(200).json(messages)
      } catch (error) {
            console.error('Error retrieving messages:', error)
            return res.status(400).json({ msg: 'Invalid message data passed into request' })
      }
}
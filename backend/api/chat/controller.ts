
import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../../models/types'
import { Chat } from '../../models/chat.model'

export async function createChat (req: AuthenticatedRequest, res: Response) {
      const { name } = req.body

      const chat = new Chat({
            name,
            user: req.user._id
      })

      const createdChat = await chat.save()

      res.status(201).json(createdChat)
}
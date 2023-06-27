import { AuthenticatedRequest } from "../../models/types"
import { Response } from "express"
import { Chat } from "../../models/chat.model"
import { Message } from "../../models/message.model"
import { User } from "../../models/user.model"

export async function sendMessage(req: AuthenticatedRequest, res: Response) {
      const {content , chatId} = req.body
 
      if(!content || !chatId) {
            return res.status(400).json({msg: 'Invalid message data passed into request'})
      }

      const newMessage = {
            sender: req.user?._id,
            content,
            chat: chatId
      }
      try {
            let message = await Message.create(newMessage)

  
            message = await message.populate('sender', 'username profileImg')
            message = await message.populate('chat')
            message = await User.populate(message , {path: 'chat.users' , select: 'username email profileImg'})
            console.log(message)
            await Chat.findByIdAndUpdate(chatId , {latestMessage: message})

            res.status(201).json(message)
      } catch (error) {
            res.status(400).json({msg: 'Invalid message data passed into request'})
            throw new Error(error.message)
      }
}

export async function getAllMessages(req: AuthenticatedRequest, res: Response) {
      console.log(req.params)
      const {chatId} = req.params

      if(!chatId) {
            return res.status(400).json({msg: 'Invalid message data passed into request'})
      }

      try {
            const messages = await Message.find({chat: chatId})
            .populate('sender', 'username profileImg')
            .populate('chat')
            // .populate('chat.users' , 'username email profileImg')

            res.status(200).json(messages)
      } catch (error) {
            res.status(400).json({msg: 'Invalid message data passed into request'})
            throw new Error(error.message)
      }
}
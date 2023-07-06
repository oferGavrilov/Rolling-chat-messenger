import { Message } from "../../models/message.model"
import { User } from "../../models/user.model"
import { Chat } from "../../models/chat.model"
import { handleErrorService } from "../../middleware/errorMiddleware"

export async function sendMessageService (senderId: string, content: string, chatId: string) {
      if (!content || !chatId) {
            throw new Error('Invalid message data passed into request')
      }

      try {
            const newMessage = {
                  sender: senderId,
                  content,
                  chat: chatId
            }

            let message = await Message.create(newMessage)
            message = await message.populate('sender', 'username profileImg')
            message = await message.populate('chat')
            message = await User.populate(message, { path: 'chat.users', select: 'username email profileImg' })

            await Chat.findByIdAndUpdate(chatId, { latestMessage: message })

            return message
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function getAllMessagesByChatId (chatId: string | undefined) {
      if (!chatId) {
            throw new Error('Invalid message data passed into request')
      }

      try {
            const messages = await Message.find({ chat: chatId })
                  .populate('sender', 'username profileImg')
                  .populate('chat')

            return messages
      } catch (error: any) {
            throw handleErrorService(error)
      }
}
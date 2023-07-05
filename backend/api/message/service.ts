import { Message } from "../../models/message.model"
import { User } from "../../models/user.model"
import { Chat } from "../../models/chat.model"

export async function sendMessageService (senderId: string, content: string, chatId: string) {
      if (!content || !chatId) {
            throw new Error('Invalid message data passed into request')
      }

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
}

export async function getAllMessagesByChatId (chatId: string) {
      if (!chatId) {
            throw new Error('Invalid message data passed into request')
      }

      const messages = await Message.find({ chat: chatId })
            .populate('sender', 'username profileImg')
            .populate('chat')

      return messages
}
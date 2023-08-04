import { IMessage, Message } from "../../models/message.model"
import { Chat } from "../../models/chat.model"
import { handleErrorService } from "../../middleware/errorMiddleware"
import { PopulatedDoc } from "mongoose"

export async function sendMessageService (senderId: string, content: string, chatId: string, messageType: string) {

      if(!content) throw new Error('No content passed into request')
      if(!chatId) throw new Error('No chatId passed into request')
      if(!messageType) throw new Error('No messageType passed into request')
      if(!senderId) throw new Error('No senderId passed into request')

      try {
            const newMessage = {
                  sender: senderId,
                  content,
                  chat: chatId,
                  messageType: messageType, 
            }

            let message = await Message.create(newMessage)

            message = (await message.populate('sender', 'username profileImg')) as PopulatedDoc<IMessage>

            message = (await message.populate('chat')) as PopulatedDoc<IMessage>

            // Check if the other user ID is in the deletedBy array
            const chat = await Chat.findById(chatId)
            const otherUserId = chat.users.find((user) => user.toString() !== senderId.toString())

            if (otherUserId && chat.deletedBy.includes(otherUserId.toString())) {
                  // Remove the other user ID from the deletedBy array
                  chat.deletedBy = chat.deletedBy.filter((userId) => userId.toString() !== otherUserId.toString())
                  await chat.save()
            }

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
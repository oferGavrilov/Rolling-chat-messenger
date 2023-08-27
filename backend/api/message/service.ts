import { IMessage, Message, ReplyMessage } from "../../models/message.model.js"
import { Chat } from "../../models/chat.model.js"
import { handleErrorService } from "../../middleware/errorMiddleware.js"
import { PopulatedDoc } from "mongoose"

export async function sendMessageService (senderId: string, content: string, chatId: string, messageType: string, replyMessage: ReplyMessage | null, messageSize?: number) {

      if (!content) throw new Error('No content passed into request')
      if (!chatId) throw new Error('No chatId passed into request')
      if (!messageType) throw new Error('No messageType passed into request')
      if (!senderId) throw new Error('No senderId passed into request')

      try {
            const newMessage = {
                  sender: senderId,
                  content,
                  chat: chatId,
                  messageType,
                  replyMessage: replyMessage ? replyMessage : null,
                  messageSize: messageSize ? messageSize : undefined
            }

            let message = await Message.create(newMessage)

            message = (await message.populate('sender', 'username profileImg')) as PopulatedDoc<IMessage>
            message = (await message.populate({ path: 'chat', populate: { path: 'users', select: '-password' } })) as PopulatedDoc<IMessage>;
            message = (await message.populate({
                  path: 'replyMessage',
                  select: '_id content sender',
                  populate: {
                        path: 'sender',
                        select: '_id username profileImg'
                  }
            })) as PopulatedDoc<IMessage>;

            // Check if the other user ID is in the deletedBy array
            const chat = await Chat.findById(chatId)
            const otherUserId = chat.users.find((user) => user.toString() !== senderId.toString())

            if (otherUserId && chat.deletedBy.some((user) => user.toString() === otherUserId.toString())) {
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

export async function getAllMessagesByChatId (chatId: string, userId: string) {
      if (!chatId) {
            throw new Error('Invalid message data passed into request')
      }

      try {
            const messages = await Message.find({ chat: chatId, deletedBy: { $ne: userId } })
                  .populate('sender', 'username profileImg')
                  .populate('chat')
                  .populate({
                        path: 'replyMessage',
                        select: '_id content sender',
                        populate: {
                              path: 'sender',
                              select: '_id username profileImg'
                        }
                  });

            return messages
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function removeMessageService (messageId: string, chatId: string, userId: string): Promise<void> {
      try {
            const chat = await Chat.findById(chatId)
            if (!chat) throw new Error('Chat not found')

            const message = await Message.findById(messageId)
            if (!message) throw new Error('Message not found')

            if (message.deletedBy.includes(userId)) throw new Error('Message already deleted')

            message.deletedBy.push(userId)

            if (message.deletedBy.length === chat.users.length) {
                  await Message.findByIdAndDelete(messageId)
            } else {
                  await message.save()
            }

      } catch (error: any) {
            throw handleErrorService(error)
      }

}
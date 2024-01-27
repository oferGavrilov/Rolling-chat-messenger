import { IMessage, Message, ReplyMessage } from "../../models/message.model.js"
import { Chat } from "../../models/chat.model.js"
import CustomError, { handleErrorService } from "../../middleware/errorMiddleware.js"
import { PopulatedDoc } from "mongoose"
import createError from 'http-errors'
import logger from "../../services/logger.service.js"

export async function sendMessageService(senderId: string, content: string, chatId: string, messageType: string, replyMessage: ReplyMessage | null, messageSize?: number) {

      try {
            const newMessage = {
                  sender: senderId,
                  content,
                  chat: chatId,
                  messageType,
                  replyMessage: replyMessage ? replyMessage : null,
                  messageSize: messageSize ? messageSize : undefined,
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
            chat.deletedBy = []
            await chat.save()

            if (otherUserId && chat.deletedBy.some(({ userId }) => userId.toString() === otherUserId.toString())) {
                  // Remove the other user ID from the deletedBy array
                  //chat.deletedBy = chat.deletedBy.filter(({ userId }) => userId.toString() !== otherUserId.toString())
                  // await chat.save()

            }

            await Chat.findByIdAndUpdate(chatId, { latestMessage: message })
            return message
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function getAllMessagesByChatId(chatId: string, userId: string) {
      try {
            const messages = await Message.find({ chat: chatId, deletedBy: { $ne: userId } })
                  .populate('sender', 'username profileImg')
                  .populate({
                        path: 'replyMessage',
                        select: '_id content sender messageType',
                        populate: {
                              path: 'sender',
                              select: '_id username profileImg'
                        }
                  });

            // update unread messages in chat
            messages.forEach((message) => {
                  if (!message.isReadBy.some(({ userId: id }) => id.toString() === userId.toString())) {
                        message.isReadBy.push({ userId, readAt: new Date() })
                  }
            })

            await Promise.all(messages.map(async (message) => await message.save()))

            return messages
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function removeMessageService(messageId: string, chatId: string, userId: string): Promise<void> {
      try {
            const chat = await Chat.findById(chatId)
            if (!chat) throw new CustomError('Chat not found', 'You are not allowed to do that.', 403)
            
            const message = await Message.findById(messageId)
            if (!message) throw new CustomError('Message not found', 'You are not allowed to do that.', 403)

            if (message.deletedBy.includes(userId)) throw new CustomError('Message already deleted', 'You are not allowed to do that.', 403)

            message.deletedBy.push(userId)

            if (message.deletedBy.length === chat.users.length) {
                  await Message.findByIdAndDelete(messageId)
            } else {
                  await message.save()
            }

      } catch (error: any) {
            const statusCode: number = error.statusCode || 500;
            logger.error(`[API] - While Deleting Message: ${error.message}`, { statusCode, userId })
            throw { statusCode: error.statusCode as number, message: error.message as string };
      }
}

export async function readMessagesService(messageIds: string[], chatId: string, userId: string): Promise<void> {
      console.log(messageIds, chatId, userId)
      try {
            await Message.updateMany(
                  { _id: { $in: messageIds }, chat: chatId },
                  { $addToSet: { isReadBy: { userId: userId, readAt: new Date() } } }
            );
      } catch (error: any) {
            throw handleErrorService(error)
      }
}     
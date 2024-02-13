import { IMessage, Message, ReplyMessage } from "../../models/message.model.js"
import { Chat } from "../../models/chat.model.js"
import { ForbiddenError, InternalServerError, NotFoundError, ValidationError } from "../../utils/errorHandler.js"
import logger from "../../services/logger.service.js"
import { uploadImageToCloudinary } from "src/services/cloudinary.service.js"

export async function sendMessageService(senderId: string, content: string, chatId: string, messageType: string, replyMessage: ReplyMessage | null, messageSize?: number) {
      try {
            const chat = await Chat.findById(chatId)

            if (!chat) throw new NotFoundError('Chat not found')

            // check if the user is in the group chat
            if (chat.isGroupChat && !chat.users.some((user) => user.toString() === senderId.toString())) {
                  throw new ForbiddenError('You are not in this group chat')
            }

            if (messageType === 'image' && typeof content === 'string') {
                  content = await uploadImageToCloudinary(content, 'chat_app')
            }

            const newMessage: Omit<IMessage, '_id'> = {
                  sender: senderId,
                  content,
                  chat: chatId,
                  messageType,
                  replyMessage: replyMessage ? replyMessage : null,
                  messageSize: messageSize ? messageSize : undefined,
                  deletedBy: [],
                  isReadBy: [],
                  createdAt: new Date(),
                  updatedAt: new Date()
            }

            let message = await Message.create(newMessage)

            message = await message.populate('sender', 'username profileImg')
            message = await message.populate({ path: 'chat', populate: { path: 'users', select: '-password' } })
            message = await message.populate({
                  path: 'replyMessage',
                  select: '_id content sender',
                  populate: {
                        path: 'sender',
                        select: '_id username profileImg'
                  }
            })

            if (!message) throw new InternalServerError('Failed to send message')

            if (!chat) throw new NotFoundError('Chat not found')
            chat.deletedBy = []
            await chat.save()

            await Chat.findByIdAndUpdate(chatId, { latestMessage: message })
            return message
      } catch (error: unknown) {
            if (error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof ValidationError) {
                  throw error
            } else {
                  logger.error(`Error in sendMessageService: ${error}`)
                  throw new InternalServerError('Something went wrong')
            }
      }
}

export async function getAllMessagesByChatId(chatId: string, userId: string) {
      try {
            const chat = await Chat.findById(chatId)
            if (!chat) throw new NotFoundError('Chat not found')

            const chatUserIds = chat.users.map((user) => user.toString())

            const messages = await Message.find({
                  chat: chatId,
                  deletedBy: { $not: { $all: chatUserIds } } // all messages that are not deleted by all users in chat
            })
                  .populate('sender', 'username profileImg')
                  .populate({
                        path: 'replyMessage',
                        select: '_id content sender messageType',
                        populate: {
                              path: 'sender',
                              select: '_id username profileImg'
                        }
                  })

            // update unread messages in chat
            messages.forEach((message) => {
                  if (!message.isReadBy.some(({ userId: id }) => id.toString() === userId.toString())) {
                        message.isReadBy.push({ userId, readAt: new Date() })
                  }
            })

            await Promise.all(messages.map(async (message) => await message.save()))

            return messages
      } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                  throw error
            } else {
                  logger.error(`Error in getAllMessagesByChatId: ${error}`)
                  throw new Error('Something went wrong')
            }
      }
}

export async function removeMessageService(messageId: string, chatId: string, userId: string): Promise<void> {
      try {
            const chat = await Chat.findById(chatId)
            if (!chat) throw new NotFoundError('Chat not found')

            const message = await Message.findById(messageId)
            if (!message) throw new NotFoundError('Message not found')

            if (message.deletedBy.includes(userId)) throw new ForbiddenError('Message already deleted')

            message.deletedBy.push(userId)

            if (message.deletedBy.length === chat.users.length) {
                  await Message.findByIdAndDelete(messageId)
            } else {
                  await message.save()
            }

      } catch (error: unknown) {
            if (error instanceof NotFoundError || error instanceof ForbiddenError) {
                  throw error;
            } else {
                  logger.error(`Error in removeMessageService: ${error}`);
                  throw new InternalServerError('Something went wrong in removeMessageService');
            }
      }
}

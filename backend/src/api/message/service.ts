import { IMessage, Message, ReplyMessage } from "../../models/message.model.js"
import { Chat } from "../../models/chat.model.js"
import { ForbiddenError, InternalServerError, NotFoundError, ValidationError } from "../../utils/errorHandler.js"
import logger from "../../services/logger.service.js"
import { uploadImageToCloudinary } from "../../services/cloudinary.service.js"

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
                  isReadBy: [{ userId: senderId, readAt: new Date() }],
                  createdAt: new Date(),
                  updatedAt: new Date()
            }

            let message = await Message.create(newMessage)

            message = await message.populate('sender', 'username profileImg')
            message = await message.populate({ path: 'chat', populate: { path: 'users', select: '-password -refreshToken' } })
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

// export async function getAllMessagesByChatId(chatId: string, userId: string, page = 1, limit = 50) {
//       try {
//             const chat = await Chat.findById(chatId)
//             if (!chat) throw new NotFoundError('Chat not found')

//             const skip = (page - 1) * limit;


//             const messages = await Message.find({
//                   chat: chatId,
//                   $nor: [
//                         { deletedBy: { $elemMatch: { userId, deletionType: 'forMe' } } },
//                         { deletedBy: { $elemMatch: { userId, deletionType: 'forEveryoneAndMe' } } }
//                   ]
//             })
//                   .sort({ createdAt: -1 }) // Sort by most recent messages first
//                   .skip(skip)
//                   .limit(limit)
//                   .populate('sender', 'username profileImg')
//                   .populate({
//                         path: 'replyMessage',
//                         select: '_id content sender messageType',
//                         populate: {
//                               path: 'sender',
//                               select: '_id username profileImg'
//                         }
//                   });
//                   console.log(messages)
//             // update unread messages in chat
//             messages.forEach((message) => {
//                   if (!message.isReadBy.some(({ userId: id }) => id.toString() === userId.toString())) {
//                         message.isReadBy.push({ userId, readAt: new Date() })
//                   }
//             })

//             await Promise.all(messages.map(async (message) => await message.save()))

//             return messages
//       } catch (error: unknown) {
//             if (error instanceof NotFoundError) {
//                   throw error
//             } else {
//                   logger.error(`Error in getAllMessagesByChatId: ${error}`)
//                   throw new Error('Something went wrong')
//             }
//       }
// }

export async function getAllMessagesByChatId(chatId: string, userId: string) {
      try {
            const chat = await Chat.findById(chatId)
            if (!chat) throw new NotFoundError('Chat not found')

            const messages = await Message.find({
                  chat: chatId,
                  $nor: [
                        { deletedBy: { $elemMatch: { userId, deletionType: 'forMe' } } },
                        { deletedBy: { $elemMatch: { userId, deletionType: 'forEveryoneAndMe' } } }
                  ]
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

export async function removeMessageService(messageId: string, chatId: string, userId: string, deletionType: 'forMe' | 'forEveryone'): Promise<void> {
      try {
            const chat = await Chat.findById(chatId);
            if (!chat) throw new NotFoundError('Chat not found');

            const message = await Message.findById(messageId);
            if (!message) throw new NotFoundError('Message not found');

            const userDeletionIndex = message.deletedBy.findIndex(deletion => deletion.userId.toString() === userId.toString());

            // If the message is already deleted by the user for themselves, throw an error
            if (userDeletionIndex !== -1 && message.deletedBy[userDeletionIndex].deletionType === 'forMe' && deletionType === 'forMe') {
                  throw new ForbiddenError('Message already deleted for you');
            }

            // If the message is deleted by the user for everyone, and now they want to delete for themselves, adjust the type
            if (userDeletionIndex !== -1 && message.deletedBy[userDeletionIndex].deletionType === 'forEveryone' && deletionType === 'forMe') {
                  message.deletedBy[userDeletionIndex].deletionType = 'forEveryoneAndMe'; // Adjust deletion type accordingly
            } else if (userDeletionIndex === -1) { // If there's no deletion record for this user, add one
                  message.deletedBy.push({ userId, deletionType });
            }

            // Perform deletion if all users have marked the message for deletion in some form
            if (message.deletedBy.filter(deletion => deletion.deletionType === 'forMe' || deletion.deletionType === 'forEveryoneAndMe').length === chat.users.length) {
                  await Message.findByIdAndDelete(messageId);
            } else {
                  await message.save();
            }

      } catch (error) {
            if (error instanceof NotFoundError || error instanceof ForbiddenError) {
                  throw error;
            } else {
                  console.error(`Error in removeMessageService: ${error}`);
                  throw new InternalServerError('Something went wrong in removeMessageService');
            }
      }
}


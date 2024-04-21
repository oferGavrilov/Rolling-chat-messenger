import { IMessage, Message, NewMessagePayload, ReplyMessage } from "@/models/message.model"
import { Chat } from "@/models/chat.model"
import { logger } from "@/server"
import { deleteImageFromCloudinary, uploadImageToCloudinary, uploadPdfToCloudinary } from "@/utils/cloudinary"
import { ResponseStatus, ServiceResponse } from "@/models/serviceResponse"
import { StatusCodes } from "http-status-codes"

export async function sendMessageService(
      senderId: string,
      content: string,
      chatId: string,
      messageType: string,
      replyMessage: ReplyMessage | null,
      messageSize?: number,
      file?: Express.Multer.File
): Promise<ServiceResponse<IMessage | null>> {
      try {
            const chat = await Chat.findById(chatId)
            if (!chat) return new ServiceResponse(ResponseStatus.Failed, 'Chat not found', null, StatusCodes.NOT_FOUND)

            // check if the user is in the group chat
            if (chat.isGroupChat && !chat.users.some((user) => user.toString() === senderId.toString())) {
                  return new ServiceResponse(ResponseStatus.Failed, 'You are not in this group chat', null, StatusCodes.FORBIDDEN)
            }

            let fileUrl: string = ''
            let tnFileUrl: string = ''
            let fileName: string = ''

            if (messageType === 'image' && file) {
                  const result = await uploadImageToCloudinary(file, 'chat_app')
                  fileUrl = result.originalImageUrl
                  tnFileUrl = result.tnImageUrl
                  //content = fileUrl
                  fileName = file.originalname
            } else if (messageType === 'file' && file) {
                  const result = await uploadPdfToCloudinary(file, 'chat_app')
                  fileUrl = result.pdfUrl
                  tnFileUrl = result.previewUrl
                  //content = fileUrl
                  fileName = file.originalname
            }

            const newMessage: NewMessagePayload = {
                  sender: senderId,
                  content,
                  TN_Image: tnFileUrl,
                  fileName,
                  fileUrl,
                  chat: chatId,
                  messageType,
                  replyMessage: replyMessage ? replyMessage : null,
                  messageSize: messageSize ? messageSize : undefined,
                  deletedBy: [],
                  isReadBy: [{ userId: senderId, readAt: new Date() }],
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

            if (!message) return new ServiceResponse(ResponseStatus.Failed, 'Error sending message', null, StatusCodes.INTERNAL_SERVER_ERROR)

            chat.deletedBy = []
            await chat.save()

            await Chat.findByIdAndUpdate(chatId, { latestMessage: message })
            return new ServiceResponse(ResponseStatus.Success, 'Message sent successfully', message, StatusCodes.CREATED)
      } catch (error) {
            const errorMessage = `Error in sendMessageService: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function getAllMessagesByChatId(chatId: string, userId: string): Promise<ServiceResponse<{ messages: IMessage[], newlyReadMessageIds: string[] } | null>> {
      try {
            const chat = await Chat.findById(chatId)
            if (!chat) return new ServiceResponse(ResponseStatus.Failed, 'Chat not found', null, StatusCodes.NOT_FOUND)

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
                  .populate('chat', 'users isGroupChat name profileImg') // Populate chat to get the users and group chat name

            let newlyReadMessageIds: string[] = []

            // update unread messages in chat
            messages.forEach((message) => {
                  if (!message.isReadBy.some(({ userId: id }) => id.toString() === userId.toString())) {
                        message.isReadBy.push({ userId, readAt: new Date() })
                        newlyReadMessageIds.push(message._id.toString())
                  }
            })

            await Promise.all(messages.map(async (message) => await message.save()))

            return new ServiceResponse(ResponseStatus.Success, 'Messages retrieved successfully', { messages, newlyReadMessageIds }, StatusCodes.OK)
      } catch (error: unknown) {
            const errorMessage = `Error in getAllMessagesByChatId: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function removeMessageService(messageId: string, chatId: string, userId: string, deletionType: 'forMe' | 'forEveryone'): Promise<ServiceResponse<null>> {
      try {
            const chat = await Chat.findById(chatId)
            if (!chat) return new ServiceResponse(ResponseStatus.Failed, 'Chat not found', null, StatusCodes.NOT_FOUND)

            const message = await Message.findById(messageId)
            if (!message) return new ServiceResponse(ResponseStatus.Failed, 'Message not found', null, StatusCodes.NOT_FOUND)

            const userDeletionIndex = message.deletedBy.findIndex(deletion => deletion.userId.toString() === userId.toString())

            // If the message is already deleted by the user for themselves, throw an error
            if (userDeletionIndex !== -1 && message.deletedBy[userDeletionIndex].deletionType === 'forMe' && deletionType === 'forMe') {
                  return new ServiceResponse(ResponseStatus.Failed, 'Message already deleted', null, StatusCodes.BAD_REQUEST)
            }

            // If the message is deleted by the user for everyone, and now they want to delete for themselves, adjust the type
            if (userDeletionIndex !== -1 && message.deletedBy[userDeletionIndex].deletionType === 'forEveryone' && deletionType === 'forMe') {
                  message.deletedBy[userDeletionIndex].deletionType = 'forEveryoneAndMe' // Adjust deletion type accordingly
            } else if (deletionType === 'forEveryone') {
                  message.content = 'This message was deleted'
            }

            if (userDeletionIndex === -1) { // If there's no deletion record for this user, add one
                  message.deletedBy.push({ userId, deletionType })
            }

            // Perform deletion if all users have marked the message for deletion in some form
            if (message.deletedBy.filter(deletion => deletion.deletionType === 'forMe' || deletion.deletionType === 'forEveryoneAndMe').length === chat.users.length) {
                  if (message.messageType === 'image' && message.content.trim() !== '') {
                        await deleteImageFromCloudinary(message.content, 'chat_app')
                  }
                  await Message.findByIdAndDelete(messageId)
            } else {
                  await message.save()
            }

            return new ServiceResponse(ResponseStatus.Success, 'Message deleted successfully', null, StatusCodes.OK)

      } catch (error) {
            const errorMessage = `Error in removeMessageService: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

import { GetAllMessagesInput, RemoveMessageInput, SendMessageInput } from "@/schemas/message.schema"
import { logger } from "@/server"
import { handleServiceResponse } from "@/utils/httpHandler"
import { NextFunction, Request, Response } from "express"
import { getAllMessagesByChatId, removeMessageService, sendMessageService } from "../services/message.service"

export const getAllMessagesHandler = async (
    req: Request<GetAllMessagesInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { chatId } = req.params
        const userId = req.user._id

        const response = await getAllMessagesByChatId(chatId, userId)
        handleServiceResponse(response, res)
    } catch (error) {
        const errorMessage = `Error during getAllMessagesHandler: ${(error as Error).message}`
        logger.error(errorMessage)
        next(new Error(errorMessage))
    }
}

export const sendMessageHandler = async (
    req: Request<{}, SendMessageInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const file = req?.file
        const senderId = req.user._id

        const content = req.body?.content ?? ''
        const chatId = req.body.chatId
        const messageType = req.body.messageType
        const messageSize = req.body?.messageSize ? parseInt(req.body.messageSize, 10) : undefined
        const replyMessage = req.body?.replyMessage ? JSON.parse(req.body.replyMessage) : null

        const message = await sendMessageService(senderId, content, chatId, messageType, replyMessage, messageSize, file)
        handleServiceResponse(message, res)
    } catch (error) {
        const errorMessage = `Error during sendMessageHandler: ${(error as Error).message}`
        logger.error(errorMessage)
        next(new Error(errorMessage))
    }
}

export const removeMessageHandler = async (
    req: Request<RemoveMessageInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { messageId, chatId } = req.params
        const { deletionType } = req.body ?? {}
        const userId = req.user._id

        if (messageId === 'temp-id') { // If the message is not yet saved in the database
            return res.status(200).json({ message: 'Message deleted' })
        }

        const response = await removeMessageService(messageId, chatId, userId, deletionType)
        handleServiceResponse(response, res)
    } catch (error) {
        const errorMessage = `Error during removeMessageHandler: ${(error as Error).message}`
        logger.error(errorMessage)
        next(new Error(errorMessage))
    }
}
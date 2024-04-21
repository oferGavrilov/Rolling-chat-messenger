import { NextFunction, Request, Response } from "express";
import { createChatService, createGroupChatService, getChatByIdService, getUserChatsService, kickFromGroupChatService, leaveGroupChatService, removeChatService, renameGroupChatService, updateGroupImageService, updateUsersInGroupChatService } from "../services/chat.service";
import { handleServiceResponse } from "@/utils/httpHandler";
import { CreateChatInput, CreateGroupChatInput, GetChatByIdInput, KickFromGroupChatInput, LeaveGroupChatInput, RenameGroupChatInput, UpdateGroupImageInput } from "@/schemas/chat.schema";
import { DEFAULT_GUEST_IMAGE } from "@/models/user.model";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

export const getUserChatsHandler = async (
    req: Request,
    res: Response
) => {
    const userId = req.user._id

    const serviceResponse = await getUserChatsService(userId)
    handleServiceResponse(serviceResponse, res)
}

export const getChatByIdHandler = async (
    req: Request<GetChatByIdInput>,
    res: Response
) => {
    const chatId = req.params.chatId

    const serviceResponse = await getChatByIdService(chatId)
    handleServiceResponse(serviceResponse, res)
}

export const createChatHandler = async (
    req: Request<CreateChatInput>,
    res: Response
) => {
    const { userId } = req.body
    const currentUserId = req.user._id

    const serviceResponse = await createChatService(userId, currentUserId)
    handleServiceResponse(serviceResponse, res)
}

export const createGroupChatHandler = async (
    req: Request<{}, CreateGroupChatInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { chatName, userIds } = req.body
        let groupImage = DEFAULT_GUEST_IMAGE

        if (req.file) {
            const result = await uploadImageToCloudinary(req.file, 'profiles')
            groupImage = result.originalImageUrl
        }

        // parse because the data is sent as form data, and also clean duplicates if exist
        const userIdsArray = Array.from(new Set(JSON.parse(userIds))) as string[];

        const currentUserId = req.user._id
        const serviceResponse = await createGroupChatService(userIdsArray, chatName, groupImage, currentUserId)
        handleServiceResponse(serviceResponse, res)
    } catch (error) {
        next(error)
    }
}

export const leaveGroupChatHandler = async (
    req: Request<LeaveGroupChatInput>,
    res: Response
) => {
    const { chatId } = req.body
    const userId = req.user._id

    const serviceResponse = await leaveGroupChatService(chatId, userId)
    handleServiceResponse(serviceResponse, res)
}

export const kickFromGroupChatHandler = async (
    req: Request<KickFromGroupChatInput>,
    res: Response
) => {
    const { chatId, kickedByUserId } = req.body
    const userId = req.user._id

    const serviceResponse = await kickFromGroupChatService(chatId, userId, kickedByUserId)
    handleServiceResponse(serviceResponse, res)
}

export const removeChatHandler = async (
    req: Request,
    res: Response
) => {
    const chatId = req.params.chatId
    const userId = req.user._id

    const serviceResponse = await removeChatService(chatId, userId)
    handleServiceResponse(serviceResponse, res)
}

export const renameGroupChatHandler = async (
    req: Request<RenameGroupChatInput>,
    res: Response
) => {
    const { chatId, groupName } = req.body

    const serviceResponse = await renameGroupChatService(chatId, groupName)
    handleServiceResponse(serviceResponse, res)
}

export const updateGroupImageHandler = async (
    req: Request<{}, UpdateGroupImageInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { chatId } = req.body
        let groupImageSrc = ''
        const result = await uploadImageToCloudinary(req.file as Express.Multer.File, 'profiles')
        groupImageSrc = result.originalImageUrl

        const serviceResponse = await updateGroupImageService(chatId, groupImageSrc)
        handleServiceResponse(serviceResponse, res)
    } catch (error) {
        next(error)
    }
}

export const UpdateUsersInGroupChatHandler = async (
    req: Request,
    res: Response
) => {
    const { chatId, userIds } = req.body

    const serviceResponse = await updateUsersInGroupChatService(chatId, userIds)
    handleServiceResponse(serviceResponse, res)
}

import { ServiceResponse } from "@/models/serviceResponse"
import { IUser } from "@/models/user.model"
import { NextFunction, Request, Response } from "express"
import { editUserDetailsService, editUserImageService, getUserStatusService, getUsersService } from "../services/user.service"
import { handleServiceResponse } from "@/utils/httpHandler"
import { EditUserDetailsInput, EditUserImageInput, GetUserStatusInput } from "@/schemas/user.schema"
import { uploadImageToCloudinary } from "@/utils/cloudinary"

export const getUsersHandler = async (
    req: Request,
    res: Response
) => {
    const userId = req.user._id
    const users: ServiceResponse<IUser[] | null> = await getUsersService(userId)
    handleServiceResponse(users, res)
}

export const getUserStatusHandler = async (
    req: Request<GetUserStatusInput>,
    res: Response
) => {
    const userId = req.params.userId

    const userStatus: ServiceResponse<{ isOnline: boolean, lastSeen?: Date } | null> = await getUserStatusService(userId)
    handleServiceResponse(userStatus, res)
}

export const editUserDetailsHandler = async (
    req: Request<EditUserDetailsInput>,
    res: Response
) => {
    const { newName, fieldToUpdate } = req.body
    const userId = req.user._id

    const cleanName = newName.replace(/[/>]/g, '').trim()

    const serviceResponse: ServiceResponse<{ newUserValue: string, field: 'username' | 'about' } | null> = await editUserDetailsService(userId, cleanName, fieldToUpdate)
    handleServiceResponse(serviceResponse, res)
}

export const editUserImageHandler = async (
    req: Request<{}, EditUserImageInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const profileImg = req.file
        const userId = req.user?._id

        const result = await uploadImageToCloudinary(profileImg as Express.Multer.File, 'profiles')
        let profileImgToSave: string = result.originalImageUrl
        let TN_profileImgToSave: string = result.tnImageUrl

        const serviceResponse: ServiceResponse<{ newProfileImg: string, newTN_profileImg: string } | null> = await editUserImageService(userId, profileImgToSave, TN_profileImgToSave)
        handleServiceResponse(serviceResponse, res)
    } catch (error) {
        next(error)
    }
}
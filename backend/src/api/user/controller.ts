import { type Request, type Response } from "express"
import { editUserDetailsService, editUserImageService, getUserStatusById, getUsersService } from "./service"
import { handleServiceResponse } from "@/utils/httpHandler"
import { ServiceResponse } from "@/models/serviceResponse"
import { IUser } from "@/models/user.model"
import { uploadImageToCloudinary } from "@/services/cloudinary.service"

export async function getUsers(req: Request, res: Response) {
      const userId = req.user._id
      const users: ServiceResponse<IUser[] | null> = await getUsersService(userId)
      handleServiceResponse(users, res)
}

export async function editUserDetails(req: Request, res: Response) {
      const { newName, fieldToUpdate } = req.body
      const userId = req.user._id

      if (!fieldToUpdate) return res.status(400).json({ message: 'No field to update.' })

      const cleanName = newName.replace(/[/>]/g, '').trim()

      if (!cleanName) return res.status(400).json({ message: 'Name is required.' })

      const serviceResponse: ServiceResponse<{ newUserValue: string, field: 'username' | 'about' } | null> = await editUserDetailsService(userId, cleanName, fieldToUpdate)
      handleServiceResponse(serviceResponse, res)
}

export async function editUserImage(req: Request, res: Response) {
      const profileImg = req.file
      const userId = req.user?._id
      
      if (!profileImg) return res.status(400).json({ message: 'Image is required.' })

      const result = await uploadImageToCloudinary(profileImg, 'profiles')
      let profileImgToSave: string = result.originalImageUrl
      let TN_profileImgToSave: string = result.tnImageUrl

      const serviceResponse: ServiceResponse<{ newProfileImg: string, newTN_profileImg: string } | null> = await editUserImageService(userId, profileImgToSave, TN_profileImgToSave)
      handleServiceResponse(serviceResponse, res)
}

export async function getUserStatus(req: Request, res: Response) {
      const userId = req.params.userId
      if (!userId) return res.status(400).json({ message: 'User not found.' })

      const userStatus: ServiceResponse<{ isOnline: boolean, lastSeen?: Date } | null> = await getUserStatusById(userId)
      handleServiceResponse(userStatus, res)
}

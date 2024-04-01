import { type Request, type Response } from "express"
import { editUserDetailsService, editUserImageService, getUserStatusById, getUsersService } from "./service"
import { handleServiceResponse } from "@/utils/httpHandler"
import { ServiceResponse } from "@/models/serviceResponse"
import { IUser } from "@/models/user.model"

export async function getUsers(req: Request, res: Response) {
      const userId = req.user._id
      const users: ServiceResponse<IUser[] | null> = await getUsersService(userId)
      handleServiceResponse(users, res)
}

export async function editUserDetails(req: Request, res: Response) {
      const { newName } = req.body
      const userId = req.user._id

      if (!newName) return res.status(400).json({ msg: 'Name is required' })

      const cleanName = newName.replace(/[/>]/g, '').trim()
      const updatedName: ServiceResponse<string | null> = await editUserDetailsService(userId, cleanName)
      handleServiceResponse(updatedName, res)
}

export async function editUserImage(req: Request, res: Response) {
      const { image, TN_profileImg } = req.body
      const userId = req.user?._id

      if (!image) return res.status(400).json({ msg: 'Image is required' })

      const user: ServiceResponse<{ image: string, TN_profileImg: string } | null> = await editUserImageService(userId, image, TN_profileImg)
      handleServiceResponse(user, res)
}

export async function getUserStatus(req: Request, res: Response) {
      const userId = req.params.userId
      if (!userId) return res.status(400).json({ msg: 'User ID is required' })

      const userStatus: ServiceResponse<{ isOnline: boolean, lastSeen?: Date } | null> = await getUserStatusById(userId)
      handleServiceResponse(userStatus, res)
}

import { IUser, User } from "@/models/user.model"
import { ResponseStatus, ServiceResponse } from "@/models/serviceResponse"
import { StatusCodes } from "http-status-codes"
import { logger } from "@/server"

export async function getUsersService(loggedInUserId: string): Promise<ServiceResponse<IUser[] | null>> {
      try {
            const users = await User.find({ _id: { $ne: loggedInUserId } })
            return new ServiceResponse(ResponseStatus.Success, 'Users fetched successfully', users, StatusCodes.OK)
      } catch (error: unknown) {
            const errorMessage = `Error while fetching users: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function editUserDetailsService(userId: string, newName: string): Promise<ServiceResponse<string | null>> {
      try {
            const user = await User.findById(userId)

            if (!user) {
                  return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND)
            }

            user.username = newName
            await user.save()

            return new ServiceResponse(ResponseStatus.Success, 'User updated successfully', newName, StatusCodes.OK)
      } catch (error: unknown) {
            const errorMessage = `Error while updating user: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function editUserImageService(userId: string, newImage: string, newTNImage: string = ''): Promise<ServiceResponse<{ image: string, TN_profileImg: string } | null>> {
      try {
            const user = await User.findById(userId)
            if (!user) {
                  return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND)
            }

            user.profileImg = newImage
            user.TN_profileImg = newTNImage
            await user.save()

            return new ServiceResponse(ResponseStatus.Success, 'User image updated successfully', { image: user.profileImg, TN_profileImg: user.TN_profileImg }, StatusCodes.OK)
      } catch (error: unknown) {
            const errorMessage = `Error while updating user image: ${(error as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}

export async function getUserStatusById(userId: string): Promise<ServiceResponse<{ isOnline: boolean, lastSeen?: Date } | null>> {
      try {
            const user = await User.findById(userId).select('isOnline lastSeen')

            if (!user) {
                  return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND)
            }

            return new ServiceResponse(ResponseStatus.Success, 'User status fetched successfully', { isOnline: user.isOnline, lastSeen: user.lastSeen }, StatusCodes.OK)
      } catch (err) {
            const errorMessage = `Error while fetching user status: ${(err as Error).message}`
            logger.error(errorMessage)
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
      }
}
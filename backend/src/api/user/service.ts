import { User } from "../../models/user.model.js"
import { handleErrorService } from "../../middleware/errorMiddleware.js"

export async function searchUsers(keyword: string): Promise<User[]> {
      try {
            const clearString = keyword?.replace(/[/>]/g, '');

            const filter = clearString ? {
                  $or: [
                        { username: { $regex: clearString, $options: 'i' } },
                        { email: { $regex: clearString, $options: 'i' } }
                  ]
            } : {}

            const users = await User.find({ ...filter })
            return users
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

export async function getUsersService(loggedInUserId: string): Promise<User[]> {
      try {
            const users = await User.find({ _id: { $ne: loggedInUserId } })
            return users
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

export async function editUserDetailsService(userId: string, newName: string): Promise<User | null> {
      try {
            const user = await User.findById(userId)

            if (user) {
                  user.username = newName
                  await user.save()
                  return user
            }

            return null
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

export async function editUserImageService(userId: string, newImage: string): Promise<string | null> {
      try {
            const user = await User.findById(userId)

            if (user) {
                  user.profileImg = newImage
                  await user.save()
                  return user.profileImg
            }

            return null
      } catch (error: unknown) {
            if (error instanceof Error) {
                  throw handleErrorService(error)
            } else {
                  throw error
            }
      }
}

interface UserStatus {
      isOnline: boolean;
      lastSeen?: Date;
}

export async function getUserStatusById(userId: string): Promise<UserStatus> {
      try {
            // return the user status
            console.log('userId', userId)
            const user = await User.findById(userId).select('isOnline lastSeen')

            if (!user) {
                  throw new Error('User not found')
            }

            return {
                  isOnline: user.isOnline,
                  lastSeen: user.lastSeen
            }
      } catch (err) {
            if (err instanceof Error) {
                  throw handleErrorService(err)
            } else {
                  throw err
            }
      }
}
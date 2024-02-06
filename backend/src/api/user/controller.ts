import type { Response, Request } from "express"
import type { AuthenticatedRequest } from "../../models/types.js"
import { editUserDetailsService, editUserImageService, getUserStatusById, getUsersService, searchUsers } from "./service.js"
import logger from "../../services/logger.service.js"

export async function searchUsersByKeyword(req: Request, res: Response) {
      const { search } = req.query
      const keyword = search?.toString() || ''

      try {
            const users = await searchUsers(keyword)
            res.status(200).send(users)
      } catch (error: unknown) {
            if (error instanceof Error) {
                  logger.error('Error during searchUsersByKeyword:', error)
                  return res.status(500).json({ msg: 'Internal server error' })
            } else {
                  throw error
            }
      }
}

export async function getUsers(req: AuthenticatedRequest, res: Response) {
      const loggedInUserId = req.user?._id

      try {
            const users = await getUsersService(loggedInUserId)
            res.status(200).json(users)
      } catch (error: unknown) {
            if (error instanceof Error) {
                  logger.error('Error during getUsers:', error)
                  return res.status(500).json({ msg: 'Internal server error' })
            } else {
                  throw error
            }
      }
}

export async function editUserDetails(req: AuthenticatedRequest, res: Response) {
      const { newName } = req.body
      const userId = req.user?._id

      try {
            const newNameToSave = newName?.replace(/[/>]/g, '').trim();
            const user = await editUserDetailsService(userId, newNameToSave)

            if (user) {
                  res.status(200).json({ message: 'User details updated successfully' })

            } else {
                  res.status(404).json({ msg: 'User not found' })
            }
      } catch (error: unknown) {
            if (error instanceof Error) {
                  logger.error('Error during editUserDetails:', error)
                  return res.status(500).json({ msg: 'Internal server error' })
            } else {
                  throw error
            }
      }
}

export async function editUserImage(req: AuthenticatedRequest, res: Response) {
      const { image } = req.body
      const userId = req.user?._id

      try {
            const user = await editUserImageService(userId, image)

            if (user) {
                  res.status(200).json({ message: 'User image updated successfully' })
            } else {
                  res.status(404).json({ msg: 'User not found' })
            }
      } catch (error: unknown) {
            if (error instanceof Error) {
                  logger.error('Error during editUserImage:', error)
                  return res.status(500).json({ msg: 'Internal server error' })
            } else {
                  throw error
            }
      }
}

export async function getUserStatus(req: AuthenticatedRequest, res: Response) {
      const userId = req.params.userId

      if (!userId) {
            return res.status(400).json({ msg: 'User ID is required' })
      }
      try {
            const userStatus = await getUserStatusById(userId)
            res.status(200).json(userStatus)
      } catch (err: unknown) {
            if (err instanceof Error) {
                  logger.error('Error during getUserStatus:', err)
                  return res.status(500).json({ msg: 'Internal server error' })
            } else {
                  throw err
            }
      }
}

import { generateToken } from "../../config/generateToken"
import type { Response, Request } from "express"
import type { AuthenticatedRequest } from "../../models/types"
import { editUserDetailsService, editUserImageService, getUsersService, loginUser, searchUsers, signUpUser, updateUserStatus } from "./service"
import { handleErrorService } from "../../middleware/errorMiddleware"

export async function signUp (req: AuthenticatedRequest, res: Response) {
      const { username, email, password, profileImg } = req.body

      try {
            const result = await signUpUser(username, email, password, profileImg)

            if (result.error) {
                  return res.status(400).json({ msg: result.error })
            }

            const { user } = result

            if (user) {
                  return res.status(201).json({ ...result.user, isOnline: true })
            }

      } catch (error) {
            console.error('Error during sign up:', error)
            return res.status(500).json({ msg: 'Internal server error' })
      }
}

export async function login (req: AuthenticatedRequest, res: Response) {
      console.log('login')
      const { email, password } = req.body

      try {
            const result = await loginUser(email, password)

            if (result.error) {
                  return res.status(401).json({ msg: result.error })
            }

            const { user } = result

            if (user) {
                  res.json({
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        profileImg: user.profileImg,
                        about: user.about,
                        token: generateToken(user._id),
                        isOnline: true,
                  })
            } else {
                  throw new Error('User not found')
            }
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function logoutUser(req: Request, res: Response) {
      const userId = (req as AuthenticatedRequest).user?._id 
    
      try {
        await updateUserStatus(userId)
    
        res.status(200).json({ message: 'User logged out successfully' })
      } catch (error: any) {
        res.status(500).json({ error: 'Server error' })
      }
    }

export async function searchUsersByKeyword (req: Request, res: Response) {
      const { search } = req.query
      const keyword = search?.toString() || ''

      try {
            const users = await searchUsers(keyword)
            res.send(users)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function getUsers (req: AuthenticatedRequest, res: Response) {
      const loggedInUserId = req.user?._id
      const { userId } = req.params

      try {
            const users = await getUsersService(loggedInUserId , userId)
            res.send(users)
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function editUserDetails (req: AuthenticatedRequest, res: Response) {
      const { newName } = req.body
      const userId = req.user?._id

      try {
            const newNameToSave = newName?.replace(/[\/>]/g, '').trim()
            const user = await editUserDetailsService(userId, newNameToSave)

            if (user) {
                  res.send(user)
            } else {
                  res.status(404).json({ msg: 'User not found' })
            }
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function editUserImage (req: AuthenticatedRequest, res: Response) {
      const { image } = req.body
      const userId = req.user?._id

      try {
            const user = await editUserImageService(userId, image)

            if (user) {
                  res.send(user)
            } else {
                  res.status(404).json({ msg: 'User not found' })
            }
      } catch (error: any) {
            throw handleErrorService(error)
      }
}
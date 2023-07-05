import { generateToken } from "../../config/generateToken"
import { Response } from "express"
import { AuthenticatedRequest } from "../../models/types"
import { editUserDetailsService, getAllUsers, loginUser, searchUsers, signUpUser } from "./service"

export async function signUp (req: AuthenticatedRequest, res: Response) {
      const { username, email, password, profileImg } = req.body

      try {
            const result = await signUpUser(username, email, password, profileImg)

            if (result.error) {
                  return res.status(400).json({ msg: result.error })
            }

            return res.status(201).json(result.user)
      } catch (error) {
            console.error('Error during sign up:', error)
            return res.status(500).json({ msg: 'Internal server error' })
      }
}

export async function login (req: AuthenticatedRequest, res: Response) {
      const { email, password } = req.body

      try {
            const result = await loginUser(email, password)

            if (result.error) {
                  return res.status(401).json({ msg: result.error })
            }

            const { user } = result

            res.json({
                  _id: user._id,
                  username: user.username,
                  email: user.email,
                  profileImg: user.profileImg,
                  about: user.about,
                  theme: user.theme,
                  token: generateToken(user._id),
            })
      } catch (error) {
            console.error('Error during login:', error)
            return res.status(500).json({ msg: 'Internal server error' })
      }
}

export async function searchUsersByKeyword (req: AuthenticatedRequest, res: Response) {
      const { search } = req.query
      const keyword = search?.toString()

      try {
            const users = await searchUsers(keyword)
            res.send(users)
      } catch (error) {
            console.error('Error during user search:', error)
            return res.status(500).json({ msg: 'Internal server error' })
      }
}

export async function getUsers (req: AuthenticatedRequest, res: Response) {
      const userId = req.user?._id

      try {
            const users = await getAllUsers(userId)
            res.send(users)
      } catch (error) {
            console.error('Error retrieving users:', error)
            return res.status(500).json({ msg: 'Internal server error' })
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
      } catch (error) {
            console.error('Error during user name change:', error)
            return res.status(500).json({ msg: 'Internal server error' })
      }
}

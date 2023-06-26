import { User } from "../../models/user.model"
import { generateToken } from "../../config/generateToken"
import { Request, Response } from "express"
import { AuthenticatedRequest } from "../../models/types"

export async function signUp (req: Request, res: Response) {
      const { username, email, password, profileImg } = req.body;

      if (!username || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
      }

      const userExists = await User.findOne({ email })

      if (userExists) {
            return res.status(400).json({ msg: 'User already exists' });
      }

      const newUser = await User.create({
            username,
            email,
            password,
            profileImg,
      })

      if (newUser) {
            res.status(201).json({
                  _id: newUser._id,
                  username: newUser.username,
                  email: newUser.email,
                  profileImg: newUser.profileImg,
                  token: generateToken(newUser._id)
            })
      } else {
            res.status(400).json({ msg: 'Invalid user data' })
      }

}

export async function login (req: Request, res: Response) {
      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (user && (await user.matchPassword(password))) {
            res.json({
                  _id: user._id,
                  username: user.username,
                  email: user.email,
                  profileImg: user.profileImg,
                  token: generateToken(user._id)
            })
      } else {
            res.status(401).json({ msg: 'Invalid email or password' })
      }
}

export async function searchUsersByKeyword (req: AuthenticatedRequest, res: Response) {
      const clearString = req.query.search?.toString().replace(/[\/>]/g, '')
      try {
            const filter = clearString ? {
                  $or: [
                        { username: { $regex: clearString, $options: 'i' } },
                        { email: { $regex: clearString, $options: 'i' } }
                  ]
            } : {}
            const users = await User.find({ ...filter, _id: { $ne: req.user?._id } });
            res.send(users)
      } catch (err) {
            throw new Error(err)
      }
}

export async function getUsers (req: AuthenticatedRequest, res: Response) {
      try {
            const users = await User.find({ _id: { $ne: req.user?._id } });
            res.send(users)
      } catch (err) {
            throw new Error(err)
      }
}
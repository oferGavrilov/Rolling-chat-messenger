import { User } from "../../models/user.model"
import { generateToken } from "../../config/generateToken"
import { Request, Response } from "express";

export async function signUp (req: Request, res: Response) {
      const { name, email, password, pic } = req.body;

      if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
      }

      const userExists = await User.findOne({ email })

      if (userExists) {
            return res.status(400).json({ msg: 'User already exists' });
      }

      const newUser = await User.create({
            name,
            email,
            password,
            profilePicUrl: pic
      })

      if (newUser) {
            res.status(201).json({
                  _id: newUser._id,
                  name: newUser.name,
                  email: newUser.email,
                  profilePicUrl: newUser.profilePicUrl,
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
                  name: user.name,
                  email: user.email,
                  profilePicUrl: user.profilePicUrl,
                  token: generateToken(user._id)
            })
      } else {
            res.status(401).json({ msg: 'Invalid email or password' })
      }
}
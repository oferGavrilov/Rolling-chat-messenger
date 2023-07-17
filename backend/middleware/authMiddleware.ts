import jwt, { type Secret } from 'jsonwebtoken'
import { User } from '../models/user.model'
import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../models/types.js'
import { Chat } from '../models/chat.model'

interface DecodedToken extends jwt.JwtPayload {
      id: string
}

export async function protect (req: AuthenticatedRequest, res: Response, next: NextFunction) {
      let token: string | undefined

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                  token = req.headers.authorization.split(' ')[1]
                  if (!token) {
                        throw new Error('No token provided');
                  }
                  const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken
                  req.user = await User.findById(decoded.id).select('-password')

                  next()

            } catch (error) {
                  console.error('this', error)
                  res.status(401).json({ msg: 'Not authorized, token failed' })
            }
      }
      if (!token) {
            res.status(401).json({ msg: 'Not authorized, no token' })
      }
}

export async function admin (req: AuthenticatedRequest, res: Response, next: NextFunction) {
      const { chatId } = req.body
      let token: string | undefined

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                  token = req.headers.authorization.split(' ')[1]
                  if (!token) {
                        return res.status(401).json({ msg: 'Not authorized, no token' })
                  }

                  const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken
                  req.user = await User.findById(decoded.id).select('-password')

                  const chat = await Chat.findById(chatId)
                  if (chat && chat.groupAdmin && chat.groupAdmin.toString() === req.user?._id.toString()) {
                        next()
                  } else {
                        return res.status(401).json({ msg: 'Not authorized as an admin' })
                  }
            } catch (error) {
                  console.error(error)
                  return res.status(401).json({ msg: 'Not authorized, token failed' })
            }
      }
}

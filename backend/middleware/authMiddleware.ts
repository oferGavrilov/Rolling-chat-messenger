import jwt from 'jsonwebtoken'
import { User } from '../models/user.model'
import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../models/types.js'

export async function protect (req: AuthenticatedRequest, res: Response, next: NextFunction) {
      let token: string

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                  token = req.headers.authorization.split(' ')[1]

                  const decoded = jwt.verify(token, process.env.JWT_SECRET)

                  req.user = await User.findById(decoded.id).select('-password')

                  next()
            } catch (error) {
                  console.error(error)
                  res.status(401).json({ msg: 'Not authorized, token failed' })
            }
      }
      if (!token) {
            res.status(401).json({ msg: 'Not authorized, no token' })
      }
}

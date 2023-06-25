import jwt from 'jsonwebtoken'
import { User } from '../models/user.model'
import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../models/types.js'
import { Chat } from '../models/chat.model'

export async function protect (req: AuthenticatedRequest, res: Response, next: NextFunction) {
      let token: string

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                  token = req.headers.authorization.split(' ')[1]
                  const decoded = await jwt.verify(token, process.env.JWT_SECRET)

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

export async function admin (req: AuthenticatedRequest, res: Response, next: NextFunction) {
      const { chatId } = req.body;
      let token: string;

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                  token = req.headers.authorization.split(' ')[1];
                  if (!token) {
                        return res.status(401).json({ msg: 'Not authorized, no token' });
                  }

                  const decoded = jwt.verify(token, process.env.JWT_SECRET);
                  req.user = await User.findById(decoded.id).select('-password');

                  const chat = await Chat.findById(chatId);
                  console.log('GroupAdmin', chat.groupAdmin, 'user', req.user?._id);
                  if (chat.groupAdmin.toString() === req.user?._id.toString()) {
                        next();
                  } else {
                        return res.status(401).json({ msg: 'Not authorized as an admin' });
                  }
            } catch (error) {
                  console.error(error);
                  return res.status(401).json({ msg: 'Not authorized, token failed' });
            }
      }
}

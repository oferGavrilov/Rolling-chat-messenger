import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../models/types.js'
import { Chat, ChatDocument } from '../models/chat.model.js'
import logger from '../services/logger.service.js'
import { generateToken } from '../config/generateToken.js'

interface DecodedToken extends jwt.JwtPayload {
      id: string
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
      try {
            const accessToken = req.cookies['accessToken']
            const refreshToken = req.cookies['refreshToken']

            if (!accessToken && !refreshToken) {
                  logger.error(`[API: ${req.path}] - Not authorized, no token`)
                  return res.status(401).json({ message: 'expired' })
            }

            let decoded
            if (accessToken) {
                  try {
                        decoded = jwt.verify(accessToken, process.env.JWT_SECRET) as DecodedToken
                  } catch (error) {
                        decoded = null // Invalid access token
                        console.log('access token verify', error)
                  }
            }

            if (decoded) {
                  req.user = await User.findById(decoded.id).select('-password')

                  if (!req.user) {
                        return res.status(401).json({ message: 'Not authorized, token failed' })
                  }
                  return next()
            }

            // Handle refresh token
            if (refreshToken) {
                  try {
                        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as DecodedToken
                        const newAccessToken = generateToken(decodedRefresh.id)

                        const isProduction = process.env.NODE_ENV === 'production'

                        res.cookie('accessToken', newAccessToken, {
                              httpOnly: true,
                              secure: isProduction,
                              sameSite: 'lax',
                              path: '/',
                              maxAge: 24 * 60 * 60 * 1000, // 24 hours
                        })

                        req.user = await User.findById(decodedRefresh.id).select('-password')
                        return next()
                  } catch (error) {
                        console.error('refresh token',error)
                        return res.status(401).json({ message: 'expired' })
                  }
            }

            return res.status(401).json({ message: 'Not authorized, token failed' })
      } catch (error) {
            console.error(error)
            return res.status(401).json({ message: 'Not authorized, token failed' })
      }
}

export async function groupAdminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
      const { chatId } = req.body
      const userId = req.user?._id

      if (!chatId) {
            return res.status(400).json({ message: "Missing chatId" })
      }

      try {
            const chat: ChatDocument = await Chat.findById(chatId)
            // check if the user is the admin of the group
            if (chat && chat?.groupAdmin.toString() === userId.toString()) {
                  next()
            } else {
                  return res.status(401).json({ message: "Not authorized as an admin" })
            }

      } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "An error occurred" })
      }
}

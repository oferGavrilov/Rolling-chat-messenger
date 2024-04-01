import { type Response, type NextFunction, type Request } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '@/models/user.model'
import { Chat, IChat } from '@/models/chat.model'
import { logger } from '@/server'
import { generateToken } from '@/config/generateToken'
import { env } from '@/utils/envConfig'

interface DecodedToken extends jwt.JwtPayload {
      id: string
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
      try {
            const accessToken = req.cookies['accessToken']
            const refreshToken = req.cookies['refreshToken']

            if (!accessToken && !refreshToken) {
                  logger.error(`[API] - No Access token and no Refresh token.`)
                  return res.status(401).json({ message: 'expired' })
            }

            let decoded
            if (accessToken) {
                  try {
                        decoded = jwt.verify(accessToken, env.JWT_SECRET) as DecodedToken
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
                        const decodedRefresh = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as DecodedToken
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
                        console.error('refresh token', error)
                        return res.status(401).json({ message: 'expired' })
                  }
            }

            return res.status(401).json({ message: 'Not authorized, token failed' })
      } catch (error) {
            console.error(error)
            return res.status(401).json({ message: 'Not authorized, token failed' })
      }
}

export async function groupAdminMiddleware(req: Request, res: Response, next: NextFunction) {
      const { chatId } = req.body
      const userId = req.user?._id

      if (!chatId) {
            return res.status(400).json({ message: "Missing chatId" })
      }

      try {
            const chat: IChat | null = await Chat.findById(chatId)
            // check if the user is the admin of the group
            if (chat && chat?.groupAdmin?.toString() === userId.toString()) {
                  next()
            } else {
                  return res.status(401).json({ message: "Not authorized as an admin" })
            }

      } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "An error occurred" })
      }
}

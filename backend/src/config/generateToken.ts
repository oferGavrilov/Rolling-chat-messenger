import jwt from 'jsonwebtoken'
import type { ObjectId } from 'mongodb'

export const generateToken = (id: ObjectId | string) => {
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
            throw new Error('JWT secret is not defined')
      }

      return jwt.sign({ id }, jwtSecret, {
            expiresIn: '1h'
      })
}

export const generateRefreshToken = (id: ObjectId | string) => {
      const jwtSecret = process.env.JWT_REFRESH_SECRET
      if (!jwtSecret) {
            throw new Error('JWT refresh secret is not defined')
      }

      return jwt.sign({ id }, jwtSecret, {
            expiresIn: '7d'
      })
}
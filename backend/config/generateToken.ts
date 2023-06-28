import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

export const generateToken = (id: ObjectId) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
      })
}


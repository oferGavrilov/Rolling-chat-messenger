import jwt from 'jsonwebtoken'
import type { ObjectId } from 'mongodb'

export const generateToken = (id: ObjectId) => {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
            throw new Error('JWT secret is not defined');
      }

      return jwt.sign({ id }, jwtSecret, {
            expiresIn: '30d'
      });
}


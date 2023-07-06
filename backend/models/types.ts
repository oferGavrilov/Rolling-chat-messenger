import type { Document } from 'mongoose'
import type { User } from '../models/user.model.js'
import type { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: Document<any, any, typeof User>
}
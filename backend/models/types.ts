import { Document } from 'mongoose'
import { User } from '../models/user.model.js'
import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: Document<any, any, typeof User>
}
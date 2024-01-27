import type { User } from '../models/user.model.js'
import type { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user: User;
  headers: {
    authorization: string;
  }
  body: {
    username?: string;
    email?: string;
    password?: string;
    profileImg?: string;
    newName?: string;
    image?: string;
    chatId?: string;
    userId?: string;
  };
  params:{
    userId: string;
    messageId: string;
  }
}

export interface RequestWithUser extends Request {
  user: User;
  body: {
    users: string[];
    chatName: string
    groupImage: string;
  }
}
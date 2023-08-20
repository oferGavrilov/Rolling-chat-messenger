import { IMessage } from "./message.model"
import { IUser } from "./user.model"

export interface IChat {
      _id: string
      chatName: string
      isGroupChat: boolean
      users: IUser[]
      groupAdmin?: IUser
      groupImage?: string
      latestMessage?: IMessage 
      createdAt?: string
      updatedAt?: string
      deletedBy?: string[]
      count?: number
}

export type LatestMessage =  {
      _id: string
      sender: {
            _id: string
            username: string
            profileImg: string
      }
      content: string | File
      chat: string
      createdAt: string
      updatedAt: string
}
import { IMessage } from "./message.model"
import { User } from "./user.model"

export interface IChat {
      _id: string
      chatName: string
      isGroupChat: boolean
      users: User[]
      groupAdmin?: User
      groupImage?: string
      latestMessage: IMessage 
      createdAt: string
      updatedAt: string
      count: number
      deletedBy: string[]
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
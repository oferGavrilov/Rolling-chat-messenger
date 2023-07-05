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
      isOnline?: boolean
      lastSeen?: string
}

export interface IGroup {
      chatName: string
      users: User[]
}

export type LatestMessage =  {
      _id: string
      sender: {
            _id: string
            username: string
            profileImg: string
      }
      content: string
      chat: string
      createdAt: string
      updatedAt: string
}
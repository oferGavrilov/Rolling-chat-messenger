import { User } from "./user.model"

export interface IChat {
      _id: string
      chatName: string
      isGroupChat: boolean
      users: User[]
      groupAdmin?: User
      groupImage?: string
      latestMessage?: LatestMessage
      createdAt: string
      updatedAt: string
}

export interface IGroup {
      chatName: string
      users: User[]
}

interface LatestMessage {
      _id: string
      sender: {
            _id: string
            email: string
      }
      content: string
      chat: string
      createdAt: string
      updatedAt: string
}
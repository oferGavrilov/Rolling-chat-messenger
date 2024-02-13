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
      kickedUsers: KickedUsers[]
      unreadMessagesCount: number
}

type KickedUsers = {
      userId: string
      kickedBy: string
      kickedAt: string
}

export type LatestMessage = {
      _id: string
      sender: {
            _id: string
            username: string
            profileImg: string
      }
      content: string | File
      chat: string
      deletedBy: string[]
      createdAt: string
      updatedAt: string
}

export interface IFile extends File {
      url?: string
      type: string
}
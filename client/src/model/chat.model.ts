import { User } from "./user.model"

export interface IChat {
      _id: string
      chatName: string
      isGroupChat: boolean
      users: User[]
      groupAdmin?: User
}


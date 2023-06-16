export interface IChat {
      _id: string
      chatName: string
      isGroupChat: boolean
      users: User[]
      groupAdmin?: User
}

type User = {
      email: string
      name: string
}
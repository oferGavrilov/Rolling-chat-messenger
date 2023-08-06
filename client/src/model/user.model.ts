export interface FormData {
      username?: string
      email: string
      password: string
      confirmPassword?: string
      profileImg?: string
}

export interface IUser {
      _id: string
      username: string
      email: string
      password: string
      profileImg: string
      createdAt: string
      updatedAt: string
      about?: string
      isOnline: boolean
      lastSeen?: string
}

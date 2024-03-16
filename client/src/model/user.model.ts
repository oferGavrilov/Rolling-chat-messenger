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
      password?: string
      profileImg: string
      TN_profileImg:string
      createdAt: string
      updatedAt: string
      about?: string
      isOnline: boolean
      lastSeen?: string
}

export interface IUserStored {
      _id: string
      username: string
      email: string
      profileImg: string
      about: string
      isOnline?: boolean
      lastSeen?: string
      createdAt: string
      updatedAt: string
}

export interface IColorPalette {
      color: string
      opacity: number
}
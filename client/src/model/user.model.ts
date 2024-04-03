export interface FormDataSubmit {
      username?: string
      email: string
      password: string
      confirmPassword?: string
      profileImg?: File
}

export interface IUser {
      _id: string
      username: string
      email: string
      profileImg: string
      TN_profileImg:string
      about: string
      isOnline: boolean
      lastSeen?: string
}

export interface IColorPalette {
      color: string
      opacity: number
}
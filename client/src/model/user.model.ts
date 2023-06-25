export interface FormData {
      username?: string
      email: string
      password: string
      confirmPassword?: string
      profileImg?: string
}

export interface User {
      _id: string
      username: string
      email: string
      password: string
      profileImg: string
      createdAt: string
      updatedAt: string
      about?: string
}
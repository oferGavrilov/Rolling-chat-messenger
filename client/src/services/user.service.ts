import { FormData, IUser } from "../model/user.model"
import axios from 'axios'
import { getConfig } from '../utils/authConfig'
import { httpService } from "./http.service"

const STORAGE_KEY = 'loggedin-user'
const env = import.meta.env.VITE_NODE_ENV

const BASE_URL = env === 'production' ? 'https://rolling-backend.onrender.com' : 'http://localhost:5000'

export const userService = {
      loginSignUp,
      sendResetPasswordMail,
      resetPasswordConfirm,
      getUsers,
      editUserDetails,
      updateUserImage,
      getLoggedinUser,
      logout,
      saveBackgroundColor,
      getBackgroundColor,
      getTheme,
      saveTheme
}

async function getUsers (): Promise<IUser[]> {
      try {
            return await httpService.get(`${BASE_URL}/api/user/all`) as IUser[]  || []

      } catch (error:any) {
            console.log(error)
            return []
      }
}

async function loginSignUp (credentials: FormData, formMode: string): Promise<IUser> {
      const path = formMode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const config = {
            ...getConfig(),
            withCredentials: true
      }

      try {
            const response = await axios.post(BASE_URL + path, credentials, config)
            const { data } = response

            if (data) {
                  _saveToLocalStorage(data)
            }

            return data
      } catch (error: any) {
            console.log(error)
            throw error
      }
}

async function sendResetPasswordMail (email: string): Promise<void> {
      try {
            await httpService.post(`${BASE_URL}/api/auth/send-reset-password-mail`, { email })
      } catch (error) {
            console.error(error)
            throw error
      }
}

async function resetPasswordConfirm(token: string, password: string): Promise<void> {
      try {
            await httpService.post(`${BASE_URL}/api/auth/reset-password`, { token, password })
      } catch (error) {
            console.error(error)
            throw error
      }
}

async function logout (): Promise<void> {
      try {
            const user = getLoggedinUser()
            if (!user) {
                  throw new Error('User is not logged in.')
            }

            await httpService.put(`${BASE_URL}/api/auth/logout`, {})

            localStorage.removeItem(STORAGE_KEY)
            
      } catch (error) {
            console.error(error)
            // window.location.reload()
            throw error
      }
}

async function updateUserImage (image: string): Promise<string> {
      try {
            const user = getLoggedinUser()
            if (!user) {
                  throw new Error('User is not logged in.')
            }

            const updatedImage = await httpService.put(`${BASE_URL}/api/user/image`, { image }) as string
            if (updatedImage) {
                  _saveToLocalStorage({ ...user, profileImg: updatedImage })
            }

            return updatedImage
      } catch (error) {
            console.error(error)
            throw error
      }
}

async function editUserDetails (newName: string, key: string): Promise<IUser> {
      try {
            const user = getLoggedinUser()
            if (!user) {
                  throw new Error('User is not logged in.')
            }

            const response = await httpService.put(`${BASE_URL}/api/user/details`, { newName }) as IUser

            if (response) {
                  const user = getLoggedinUser()
                  const userWithNewName = { ...user, [key]: newName }
                  _saveToLocalStorage(userWithNewName)
            }

            return response
      } catch (error) {
            console.error(error)
            throw error
      }
}

function getTheme (): "light" | "dark" {
      try {
            const theme = localStorage.getItem('theme')

            if (theme === "light" || theme === "dark") {
                  return theme
            } else {
                  return "light"
            }
      } catch (error) {
            console.error(error)
            return "light"
      }
}

function saveTheme (theme: "light" | "dark"): void {
      try {
            localStorage.setItem('theme', theme)
      } catch (error) {
            console.error(error)
      }
}

function saveBackgroundColor (color: string): void {
      try {
            localStorage.setItem('backgroundColor', color)
      } catch (error) {
            console.log(error)
      }
}

function getBackgroundColor (): string | null {
      try {
            return localStorage.getItem('backgroundColor')
      } catch (error) {
            console.log(error)
            return null
      }
}

export function getLoggedinUser () {
      const storedItem = localStorage.getItem(STORAGE_KEY)
      if (storedItem) {
            return JSON.parse(storedItem)
      }
}

function _saveToLocalStorage (user: FormData): FormData {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
}
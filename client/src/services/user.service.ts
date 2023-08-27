import { FormData, IUser } from "../model/user.model"
import axios, { AxiosResponse } from 'axios'
import { getAuthConfig, getConfig } from '../utils/authConfig'
import { httpService } from "./http.service"

const STORAGE_KEY = 'loggedin-user'
const env = import.meta.env.VITE_NODE_ENV

const BASE_URL = env === 'production' ? 'https://rolling-chat-messenger-server.vercel.app' : 'http://localhost:5000'

export const userService = {
      loginSignUp,
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

export function getLoggedinUser () {
      const storedItem = sessionStorage.getItem(STORAGE_KEY)
      if (storedItem) {
            return JSON.parse(storedItem)
      }
      return null
}

async function getUsers (userId?: string): Promise<IUser[] | IUser> {
      try {
            const apiUrl = userId ? `/api/auth/all/${userId}` : '/api/auth/all'

            return httpService.get(apiUrl)
      } catch (error) {
            console.error(error)
            throw error
      }
}

async function loginSignUp (credentials: FormData, login: boolean): Promise<IUser> {
      const path = login ? '/api/auth/login' : '/api/auth/signup'
      const config = getConfig()

      try {
            const response: AxiosResponse<IUser> = await axios.post(BASE_URL + path, credentials, config)
            const { data } = response
            if (data) {
                  _saveToSessionStorage(data)
            }

            return data
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

            const authConfig = getAuthConfig()
            sessionStorage.removeItem(STORAGE_KEY)
            await axios.put(BASE_URL + '/api/auth/logout', {}, authConfig)

      } catch (error) {
            console.error(error)
            throw error
      }
}

async function updateUserImage (image: string): Promise<string> {
      try {
            const user = getLoggedinUser()
            if (!user) {
                  throw new Error('User is not logged in.')
            }

            const updatedImage = await httpService.put('/api/auth/image', { image })
            if (updatedImage) {
                  _saveToSessionStorage({ ...user, profileImg: updatedImage })
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

            const response = await httpService.put('/api/auth/details', { newName })

            if (response) {
                  const user = getLoggedinUser()
                  const userWithNewName = { ...user, [key]: newName }
                  _saveToSessionStorage(userWithNewName)
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

function _saveToSessionStorage (user: FormData): FormData {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
}

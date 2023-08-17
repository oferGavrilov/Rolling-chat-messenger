import { IChat } from "../model/chat.model"
import { FormData, IUser } from "../model/user.model"
import axios, { AxiosResponse } from 'axios'
import { getAuthConfig, getConfig } from '../utils/authConfig'
import { handleAxiosError } from "../utils/handleErrors"

const STORAGE_KEY = 'loggedin-user'
const env = import.meta.env.VITE_NODE_ENV
console.log('userService env', env)
const BASE_URL = env === 'production' ? 'https://rolling-chat-messenger-server.vercel.app' : 'http://localhost:5000'

export const userService = {
      loginSignUp,
      getLoggedinUser,
      logout,
      getUsers,
      createChat,
      editUserDetails,
      updateUserImage,
      saveUserBackgroundImage,
      getBackgroundImage,
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
      const authConfig = getAuthConfig()

      try {
            const apiUrl = userId ? `/api/auth/all/${userId}` : '/api/auth/all'

            const response: AxiosResponse<IUser[]> = await axios.get(BASE_URL + apiUrl, authConfig)
            const { data } = response
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw error
      }
}

async function createChat (userId: string): Promise<IChat> {
      const config = getConfig()
      try {
            const response: AxiosResponse<IChat> = await axios.post(BASE_URL + '/api/chat', { userId }, config)
            const { data } = response
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw error
      }
}

async function loginSignUp (credentials: FormData, login: boolean): Promise<IUser> {
      console.log('base url', BASE_URL)
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
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw error
      }
}

async function updateUserImage (image: string): Promise<string> {
      const config = getAuthConfig()

      try {
            const response: AxiosResponse<string> = await axios.put(BASE_URL + '/api/auth/image', { image }, config)
            const { data } = response
            if (data) {
                  const user = getLoggedinUser()
                  _saveToSessionStorage({ ...user, image })
            }

            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw error
      }
}

async function editUserDetails (newName: string, key: string): Promise<IUser> {
      const config = getAuthConfig()

      try {
            const response: AxiosResponse<IUser> = await axios.put(BASE_URL + '/api/auth/details', { newName }, config)
            const { data } = response


            if (data) {
                  const user = getLoggedinUser()
                  const userWithNewName = { ...user, [key]: newName }
                  _saveToSessionStorage(userWithNewName)
            }

            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw error
      }
}

function getTheme (): "light" | "dark"  {
      try {
            const theme = localStorage.getItem('theme');

            if (theme === "light" || theme === "dark") {
                  return theme;
            } else {
                  return "light";
            }
      } catch (error) {
            console.log(error);
            return "light";
      }
}

function saveTheme (theme: "light" | "dark" | "black"): void {
      try {
            localStorage.setItem('theme', theme);
      } catch (error) {
            console.log(error);
      }
}

// function to save user background image to local storage
function saveUserBackgroundImage (image: string): void {
      try {
            localStorage.setItem('backgroundImage', image)
      } catch (error) {
            console.log(error)
      }
}

function getBackgroundImage (): string | null {
      try {
            return localStorage.getItem('backgroundImage')
      } catch (error) {
            console.log(error)
            return null
      }
}

async function logout (): Promise<void> {
      const authConfig = getAuthConfig()
      sessionStorage.removeItem(STORAGE_KEY)
      await axios.put(BASE_URL + '/api/auth/logout', {}, authConfig)
}

function _saveToSessionStorage (user: FormData): FormData {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
}

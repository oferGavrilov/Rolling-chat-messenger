import { IChat } from "../model/chat.model"
import { FormData, User } from "../model/user.model"
import axios, { AxiosResponse } from 'axios'
import { getAuthConfig, getConfig } from '../utils/authConfig'
import { handleAxiosError } from "../utils/handleErrors"

const STORAGE_KEY = 'loggedin-user'
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://rolling-2szg.onrender.com' : 'http://localhost:5000'
export const userService = {
      loginSignUp,
      getLoggedinUser,
      logout,
      getUsers,
      createChat,
      editUserDetails,
      updateUserImage,
      saveUserBackgroundImage,
      getBackgroundImage
}

export function getLoggedinUser () {
      const storedItem = sessionStorage.getItem(STORAGE_KEY)
      if (storedItem) {
            return JSON.parse(storedItem)
      }
      return null
}

async function getUsers (): Promise<User[]> {
      const authConfig = getAuthConfig()

      try {
            const response: AxiosResponse<User[]> = await axios.get(BASE_URL+'/api/auth/all', authConfig)
            const { data } = response
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw error
      }
}

async function createChat (userId: string): Promise<IChat> {
      const config = getConfig()
      try {
            const response: AxiosResponse<IChat> = await axios.post(BASE_URL+'/api/chat', { userId }, config)
            const { data } = response
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw error
      }
}

async function loginSignUp (credentials: FormData, login: boolean): Promise<User> {
      const path = login ? '/api/auth/login' : '/api/auth/signup'
      const config = getConfig()

      try {
            const response: AxiosResponse<User> = await axios.post(BASE_URL + path, credentials, config)
            const { data } = response
            if (data) {
                  _saveToSessionStorage(data)
            }

            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw error
      }
}

async function updateUserImage (image: string): Promise<string> {
      const config = getAuthConfig()

      try {
            const response: AxiosResponse<string> = await axios.put(BASE_URL+'/api/auth/image', { image }, config)
            const { data } = response
            if (data) {
                  const user = getLoggedinUser()
                  _saveToSessionStorage({ ...user, image })
            }

            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw error
      }
}

async function editUserDetails (newName: string, key: string): Promise<User> {
      const config = getAuthConfig()

      try {
            const response: AxiosResponse<User> = await axios.put(BASE_URL+'/api/auth/details', { newName }, config)
            const { data } = response


            if (data) {
                  const user = getLoggedinUser()
                  const userWithNewName = { ...user, [key]: newName }
                  _saveToSessionStorage(userWithNewName)
            }

            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw error
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

function logout (): void {
      sessionStorage.removeItem(STORAGE_KEY)
}

function _saveToSessionStorage (user: FormData): FormData {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
}

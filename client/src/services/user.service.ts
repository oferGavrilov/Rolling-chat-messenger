import { IChat } from "../model/chat.model"
import { FormData, User } from "../model/user.model"
import axios, { AxiosResponse } from 'axios'
import { getAuthConfig, getConfig } from '../utils/authConfig'
import { handleAxiosError } from '../utils/handleErrors'

const STORAGE_KEY = 'loggedin-user'

export const userService = {
      loginSignUp,
      getLoggedinUser,
      logout,
      getUsers,
      createChat,
      editUserDetails
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
            const response: AxiosResponse<User[]> = await axios.get('/api/auth/all', authConfig)
            const { data } = response
            return data
      } catch (err) {
            handleAxiosError(err)
            throw err
      }
}

async function createChat (userId: string): Promise<IChat> {
      const config = getConfig()
      try {
            const response: AxiosResponse<IChat> = await axios.post('/api/chat', { userId }, config)
            const { data } = response
            return data
      } catch (err) {
            handleAxiosError(err)
            throw err
      }
}

async function loginSignUp (credentials: FormData, login: boolean): Promise<User> {
      const url = login ? '/api/auth/login' : '/api/auth/signup'
      const config = getConfig()

      try {
            const response: AxiosResponse<User> = await axios.post(url, credentials, config)
            const { data } = response
            if (data) {
                  _saveToSessionStorage(data)
            }

            return data
      } catch (error) {
            handleAxiosError(error)
            throw error
      }
}

async function editUserDetails (newName: string, key: string): Promise<User> {
      const config = getAuthConfig()

      try {
            const response: AxiosResponse<User> = await axios.put('/api/auth/details', { newName }, config)
            const { data } = response

            const user = getLoggedinUser()
            const userWithNewName = { ...user, [key]: newName }

            if (data) {
                  _saveToSessionStorage(userWithNewName)
            }

            return data
      } catch (error) {
            handleAxiosError(error)
            throw error
      }
}

function logout (): void {
      sessionStorage.removeItem(STORAGE_KEY)
}

function _saveToSessionStorage (user: FormData): FormData {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
}

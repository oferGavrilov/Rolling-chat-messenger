import { FormData, User } from "../model/user.model"
import axios from 'axios'

const STORAGE_KEY = 'loggedin-user'

export function getLoggedinUser () {
      const storedItem = sessionStorage.getItem(STORAGE_KEY)
      if (storedItem) {
            return JSON.parse(storedItem)
      }
      return null
}

const authConfig = {
      headers: {
            Authorization: `Bearer ${getLoggedinUser()?.token}`
      }
}
const config = {
      headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getLoggedinUser()?.token}`
      }
}

export const userService = {
      loginSignUp,
      getLoggedinUser,
      logout,
      getUsers,
      createChat
}

async function getUsers ():Promise<User[] | []> {
      try {
            const { data } = await axios.get('/api/auth', authConfig)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}

async function createChat (userId: string) {
      try {
            const { data } = await axios.post('/api/chat', { userId }, config)
            return data
      } catch (err) {
            console.log(err)
            return null
      }
}

async function loginSignUp (credentials: FormData, login: boolean) {
      const url = login ? '/api/auth/login' : '/api/auth/signup'
      const { data } = await axios.post(url, credentials, config)
      if (data) _saveToSessionStorage(data)
      return data
}

function logout () {
      sessionStorage.removeItem(STORAGE_KEY)
}

function _saveToSessionStorage (user: FormData) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
}

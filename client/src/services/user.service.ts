import { baseConfig, getLoggedinUser } from "../helpers/config"
import { FormData, User } from "../model/user.model"
import axios from 'axios'

const STORAGE_KEY = 'loggedin-user'

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
      searchUsers,
      createChat
}

async function searchUsers (keyword: string): Promise<User[] | []> {
      try {
            const { data } = await axios.get(`/api/auth?search=${keyword}`, authConfig)
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
      const { data } = await axios.post(url, credentials, baseConfig)
      if (data) _saveToSessionStorage(data)
      console.log(data)
      return data
}

function logout () {
      sessionStorage.removeItem(STORAGE_KEY)
}

function _saveToSessionStorage (user: FormData) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
}

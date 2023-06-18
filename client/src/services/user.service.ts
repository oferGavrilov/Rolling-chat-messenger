import { FormData } from "../model/user.model"
import axios from 'axios'

const STORAGE_KEY = 'loggedin-user'

const config = {
      headers: {
            'Content-Type': 'application/json'
      }
}

export const userService = {
      loginSignUp,
      getLoggedinUser
}

async function loginSignUp (credentials: FormData, login: boolean) {
      const url = login ? '/api/auth/login' : '/api/auth/signup'
      const { data } = await axios.post(url, credentials, config)
      if (data) _saveToSessionStorage(data)
      console.log(data)
      return data
}

function getLoggedinUser () {
      const storedItem = sessionStorage.getItem(STORAGE_KEY);
      if (storedItem) {
            return JSON.parse(storedItem);
      }
      return null
}
function _saveToSessionStorage (user: FormData) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
}

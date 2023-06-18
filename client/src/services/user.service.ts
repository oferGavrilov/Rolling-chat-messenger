import {FormData}  from "../model/user.model"
import axios from 'axios'

const STORAGE_KEY = 'loggedin-user'

const config = {
      headers: {
            'Content-Type': 'application/json'
      }
}

export const userService = {
      loginSignUp,
}

async function loginSignUp (credentials: FormData, login: boolean) {
      const url = login ? '/api/auth/login' : '/api/auth/signup'
      const { data } = await axios.post(url, credentials, config)
      console.log(data)
      return data
}

// function _saveToSessionStorage (user) {
//       sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
//       return user
// }
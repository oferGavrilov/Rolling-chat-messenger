
const STORAGE_KEY = 'loggedin-user'

export function getLoggedinUser () {
      const storedItem = sessionStorage.getItem(STORAGE_KEY);
      if (storedItem) {
            return JSON.parse(storedItem);
      }
      return null
}

export const baseConfig = {
      headers: {
            'Content-Type': 'application/json'
      }
}

export const authConfig = {
      headers: {
            Authorization: `Bearer ${getLoggedinUser()?.token}`
      }
}
export const config = {
      headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getLoggedinUser()?.token}`
      }
}
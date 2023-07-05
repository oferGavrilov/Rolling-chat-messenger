import { getLoggedinUser } from '../services/user.service'

export function getAuthConfig () {
      const token = getLoggedinUser()?.token
      if (token) {
            return {
                  headers: {
                        Authorization: `Bearer ${token}`,
                  },
            }
      }
      return {}
}

export function getConfig () {
      const token = getLoggedinUser()?.token
      if (token) {
            return {
                  headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                  },
            }
      }
      return {}
}

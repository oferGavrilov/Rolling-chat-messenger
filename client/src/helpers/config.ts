import { userService } from "../services/user.service"

export const baseConfig = {
      headers: {
            'Content-Type': 'application/json'
      }
}

export const authConfig = {
      headers: {
            Authorization: `Bearer ${userService?.getLoggedinUser()?.token}`
      }
}
export const config = {
      headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userService?.getLoggedinUser()?.token}`
      }
}
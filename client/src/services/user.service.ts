import { FormData, IColorPalette, IUser } from "../model/user.model"
import { httpService } from "./http.service"

const STORAGE_KEY = 'loggedin-user'
const env = import.meta.env.VITE_NODE_ENV

const BASE_URL = env === 'production' ? 'https://server.rolling-chat.com' : 'http://localhost:5000'

export const userService = {
      getUsers,
      loginSignUp,
      logout,
      getUserConnectionStatus,
      sendResetPasswordMail,
      resetPasswordConfirm,
      editUserDetails,
      updateUserImage,
      getLoggedinUser,
      saveBackgroundColor,
      getBackgroundColor,
      getTheme,
      saveTheme,
      validateUser
}

type ValidationResponse = {
      isValid: boolean,
      user?: IUser,
}

async function getUsers(): Promise<IUser[]> {
      try {
            return await httpService.get(`${BASE_URL}/api/user/all`) as IUser[] || []

      } catch (error: any) {
            console.log(error)
            return []
      }
}

async function loginSignUp(credentials: FormData, formMode: string) {
      const path = formMode === 'login' ? '/api/auth/login' : '/api/auth/signup'

      const userData = await httpService.post(`${BASE_URL + path}`, credentials)
      if (userData) {
            _saveToLocalStorage(userData)
      }

      return userData
}

async function sendResetPasswordMail(email: string): Promise<void> {
      try {
            await httpService.post(`${BASE_URL}/api/auth/send-reset-password-mail`, { email })
      } catch (error) {
            console.error(error)
            throw error
      }
}

async function resetPasswordConfirm(token: string, password: string): Promise<void> {
      try {
            await httpService.post(`${BASE_URL}/api/auth/reset-password`, { token, password })
      } catch (error) {
            console.error(error)
            throw error
      }
}

async function logout(): Promise<void> {
      try {
            const user = getLoggedinUser()
            if (!user) {
                  process.env.NODE_ENV !== 'development' && window.location.assign('/auth')
                  throw new Error('User is not logged in.')
            }

            await httpService.put(`${BASE_URL}/api/auth/logout`, { userId: user._id })

            localStorage.removeItem(STORAGE_KEY)

      } catch (error) {
            console.error(error)
            throw error
      }
}

async function validateUser(): Promise<ValidationResponse> {
      const validateUserResponse = await httpService.get<ValidationResponse>(`${BASE_URL}/api/auth/validate`)

      if (validateUserResponse) {
            if (validateUserResponse.isValid && validateUserResponse.user) {
                  _saveToLocalStorage(validateUserResponse.user)
            }
      } 

      return validateUserResponse
}

async function getUserConnectionStatus(userId: string) {
      return await httpService.get(`${BASE_URL}/api/user/status/${userId}`)
}

async function updateUserImage(image: string, TN_profileImg: string): Promise<{ image: string, TN_profileImg: string }> {
      try {
            const user = getLoggedinUser()
            if (!user) {
                  throw new Error('User is not logged in.')
            }

            const updatedImages = await httpService.put<{ image: string, TN_profileImg: string }>(`${BASE_URL}/api/user/image`, { image, TN_profileImg })
            if (updatedImages) {
                  _saveToLocalStorage({ ...user, profileImg: updatedImages.image, TN_profileImg: updatedImages.TN_profileImg })
            }

            return updatedImages
      } catch (error) {
            console.error(error)
            throw error
      }
}

async function editUserDetails(newName: string, key: string): Promise<IUser> {
      try {
            const user = getLoggedinUser()
            if (!user) {
                  throw new Error('User is not logged in.')
            }

            const response = await httpService.put(`${BASE_URL}/api/user/details`, { newName }) as IUser

            if (response) {
                  const user = getLoggedinUser()
                  const userWithNewName = { ...user, [key]: newName }
                  _saveToLocalStorage(userWithNewName)
            }

            return response
      } catch (error) {
            console.error(error)
            throw error
      }
}

function getTheme(): "light" | "dark" {
      try {
            const theme = localStorage.getItem('theme')

            if (theme === "light" || theme === "dark") {
                  return theme
            } else {
                  return "light"
            }
      } catch (error) {
            console.error(error)
            return "light"
      }
}

function saveTheme(theme: "light" | "dark"): void {
      try {
            localStorage.setItem('theme', theme)
      } catch (error) {
            console.error(error)
      }
}

function saveBackgroundColor(color: IColorPalette): void {
      try {
            const colorString = JSON.stringify(color); // Serialize the object
            localStorage.setItem('backgroundColor', colorString)
      } catch (error) {
            console.log(error)
      }
}

function getBackgroundColor(): IColorPalette | null {
      try {
            const colorString = localStorage.getItem('backgroundColor');
            if (!colorString) return null
            return JSON.parse(colorString)
      } catch (error) {
            console.error("Error retrieving background color from localStorage:", error);
            return null;
      }
}

export function getLoggedinUser() {
      const storedItem = localStorage.getItem(STORAGE_KEY)
      if (storedItem) {
            return JSON.parse(storedItem)
      }
      return null
}

function _saveToLocalStorage(user: Partial<IUser>) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
}
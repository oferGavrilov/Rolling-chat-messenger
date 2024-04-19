import { FormDataSubmit, IColorPalette, IUser } from "../model/user.model"
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

async function loginSignUp(credentials: FormDataSubmit, formMode: string): Promise<IUser> {
      const path = formMode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      
      let userData: IUser | null = null
      
      if (formMode === 'login') {
            userData = await httpService.post<IUser>(`${BASE_URL + path}`, credentials)
      } else {
            const formData = new FormData()
            const config = {
                  headers: {
                        'Content-Type': 'multipart/form-data'
                  }
            }
            formData.append('username', credentials.username as string)
            formData.append('email', credentials.email)
            formData.append('password', credentials.password)
            formData.append('confirmPassword', credentials.confirmPassword as string)

            if (credentials.profileImg) {
                  formData.append('profileImg', credentials.profileImg)
            }

            userData = await httpService.post<IUser>(`${BASE_URL + path}`, formData, config)
      }


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

async function updateUserImage(profileImg: File): Promise<{ newProfileImg: string, newTN_profileImg: string }> {
      const user = getLoggedinUser()
      if (!user) {
            throw new Error('User is not logged in.')
      }

      const config = {
            headers: {
                  'Content-Type': 'multipart/form-data'
            }
      }

      const formData = new FormData()
      formData.append('profileImg', profileImg)

      const { newProfileImg, newTN_profileImg } = await httpService.put<{ newProfileImg: string, newTN_profileImg: string }>(`${BASE_URL}/api/user/image`, formData, config)

      if (newProfileImg) {
            _saveToLocalStorage({
                  ...user,
                  profileImg: newProfileImg,
                  TN_profileImg: newTN_profileImg
            })
      }

      return { newProfileImg, newTN_profileImg }
}

async function editUserDetails(newName: string, key: 'about' | 'username'): Promise<{ newUserValue: string, field: 'username' | 'about' }> {
      const user = getLoggedinUser()
      if (!user) {
            throw new Error('User is not logged in.')
      }

      const { newUserValue, field } = await httpService.put<{ newUserValue: string, field: 'username' | 'about' }>(`${BASE_URL}/api/user/details`, { newName, fieldToUpdate: key })
      console.log('response', newUserValue)

      if (newUserValue) {
            const user = getLoggedinUser() as IUser
            const userWithNewName = { ...user, [field]: newUserValue }
            _saveToLocalStorage(userWithNewName)
      }

      return { newUserValue, field }
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

export function getLoggedinUser(): IUser | null {
      const storedItem = localStorage.getItem(STORAGE_KEY)
      if (storedItem) {
            console.log('storedItem:', JSON.parse(storedItem))
            return JSON.parse(storedItem)
      }
      return null
}

function _saveToLocalStorage(user: IUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
}
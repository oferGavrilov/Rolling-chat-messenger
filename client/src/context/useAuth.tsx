import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { userService } from "../services/user.service"
import { useNavigate } from "react-router-dom"
import { User } from "../model/user.model"
import { IChat } from "../model/chat.model"

interface ChatContextProps {
      user: User | null
      setUser: React.Dispatch<React.SetStateAction<User | null>>
      logout: () => void,
      isAdmin: (chat: IChat, userId?: string) => boolean
}

const useAuth = createContext<ChatContextProps>({
      user: null,
      setUser: () => null,
      logout: () => null,
      isAdmin: () => false
})


export const AuthState = () => {
      return useContext(useAuth)
}

export default function AuthProvider ({ children }: { children: ReactNode }): JSX.Element {
      const [user, setUser] = useState(null)

      const navigate = useNavigate()

      useEffect(() => {
            const user = userService.getLoggedinUser()
            if (user) setUser(user)
            else navigate('/login')
      }, [navigate])

      const isAdmin = useCallback((chat: IChat, userId?: string): boolean => {
            return chat.groupAdmin._id === (userId || user?._id)
      }, [user])


      const logout = useCallback((): void => {
            userService.logout()
            setUser(null)
            navigate('/login')
      }, [navigate])

      const memoedValue = useMemo(
            () => ({
                  user,
                  setUser,
                  logout,
                  isAdmin
            }),
            [user, logout, isAdmin]
      )

      return (
            <useAuth.Provider value={memoedValue}>
                  {children}
            </useAuth.Provider>
      )
}

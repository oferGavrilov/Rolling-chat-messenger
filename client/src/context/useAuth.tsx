import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { userService } from "../services/user.service"
import { useNavigate } from "react-router-dom"
import { User } from "../model/user.model"

interface ChatContextProps {
      user: User | null
      setUser: React.Dispatch<React.SetStateAction<null>>
      logout: () => void
}

const useAuth = createContext<ChatContextProps>({
      user: null,
      setUser: () => null,
      logout: () => null,
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

     

      const logout = useCallback((): void => {
            userService.logout()
            setUser(null)
            navigate('/login')
      }, [navigate])

      const memoedValue = useMemo(
            () => ({
                  user,
                  setUser,
                  logout
            }),
            [user, logout]
      )

      return (
            <useAuth.Provider value={memoedValue}>
                  {children}
            </useAuth.Provider>
      )
}

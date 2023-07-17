import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { userService } from "../services/user.service"
import { useNavigate, useLocation } from "react-router-dom"
import { User } from "../model/user.model"
import { IChat } from "../model/chat.model"

interface ChatContextProps {
      user: User | null
      setUser: React.Dispatch<React.SetStateAction<User | null>>
      logout: () => void,
      isAdmin: (chat: IChat, userId?: string) => boolean
      chatBackground: string
      setChatBackground: React.Dispatch<React.SetStateAction<string>>
}

const AuthContext = createContext<ChatContextProps | null>(null);

export const AuthState = () => {
      const context = useContext(AuthContext);
      if (!context) {
            throw new Error("AuthState must be used within an AuthProvider");
      }
      return context;
};

export default function AuthProvider ({ children }: { children: ReactNode }): JSX.Element {
      const [user, setUser] = useState<User | null>(null)
      const [chatBackground, setChatBackground] = useState<string>(userService.getBackgroundImage() || '#ccdbdc')
      const navigate = useNavigate()
      const location = useLocation().pathname

      useEffect(() => {
            if (location === '/chat') {
                  const user = userService.getLoggedinUser()
                  if (user) setUser(user)
                  else navigate('/login')
            }
      }, [navigate])

      const isAdmin = useCallback((chat: IChat, userId?: string): boolean => {
            const currentUserId = userId || (user! as User | undefined)?._id;

            return !!chat.groupAdmin && chat.groupAdmin._id === currentUserId;
      }, [user]);

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
                  isAdmin,
                  chatBackground,
                  setChatBackground
            }),
            [user, logout, isAdmin, chatBackground]
      )

      return (
            <AuthContext.Provider value={memoedValue}>
                  {children}
            </AuthContext.Provider>
      )
}

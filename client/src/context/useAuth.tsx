import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react"
import { userService } from "../services/user.service"
import { IColorPalette, IUser } from "../model/user.model"
import { IChat } from "../model/chat.model"

interface ChatContextProps {
      user: Partial<IUser> | null
      setUser: React.Dispatch<React.SetStateAction<Partial<IUser> | null>>
      justLoggedIn: boolean;
      setJustLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
      isAdmin: (chat: IChat, userId?: string) => boolean
      chatBackgroundColor: IColorPalette
      setChatBackgroundColor: React.Dispatch<React.SetStateAction<IColorPalette>>
}

const AuthContext = createContext<ChatContextProps | null>(null)

export const AuthState = () => {
      const context = useContext(AuthContext)
      if (!context) {
            throw new Error("AuthState must be used within an AuthProvider")
      }
      return context
}

export default function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
      const [user, setUser] = useState<Partial<IUser> | null>(userService.getLoggedinUser() || null)
      const [justLoggedIn, setJustLoggedIn] = useState<boolean>(false);
      const [chatBackgroundColor, setChatBackgroundColor] = useState<IColorPalette>(userService.getBackgroundColor() || { color: '#d8f3dc', opacity: .7 })

      const isAdmin = useCallback((chat: IChat, userId?: string): boolean => {
            const currentUserId = userId || (user! as IUser | undefined)?._id
            return !!chat.groupAdmin && chat.groupAdmin._id === currentUserId
      }, [user])

      const memoedValue = useMemo(
            () => ({
                  user,
                  setUser,
                  justLoggedIn,
                  setJustLoggedIn,
                  isAdmin,
                  chatBackgroundColor,
                  setChatBackgroundColor,
            }),
            [user, justLoggedIn, isAdmin, chatBackgroundColor]
      );


      return (
            <AuthContext.Provider value={memoedValue}>
                  {children}
            </AuthContext.Provider>
      )
}

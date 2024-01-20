import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react"
import { userService } from "../services/user.service"
import { IUser } from "../model/user.model"
import { IChat } from "../model/chat.model"

interface ChatContextProps {
      user: IUser | null
      setUser: React.Dispatch<React.SetStateAction<IUser | null>>
      justLoggedIn: boolean;
      setJustLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
      isAdmin: (chat: IChat, userId?: string) => boolean
      chatBackgroundColor: string
      setChatBackgroundColor: React.Dispatch<React.SetStateAction<string>>
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
      const [user, setUser] = useState<IUser | null>(null)
      const [justLoggedIn, setJustLoggedIn] = useState<boolean>(false);
      const [chatBackgroundColor, setChatBackgroundColor] = useState<string>(userService.getBackgroundColor() || '#ccdbdc')

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

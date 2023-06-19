import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { userService } from "../services/user.service"
import { useNavigate } from "react-router-dom"
import { FormData } from "../model/user.model"
import { IChat } from "../model/chat.model"

interface ChatContextProps {
      user: FormData | null
      setUser: React.Dispatch<React.SetStateAction<null>>
      logout: () => void
      selectedChat: any
      setSelectedChat: React.Dispatch<React.SetStateAction<null>>
      chats: IChat[]
      setChats: React.Dispatch<React.SetStateAction<IChat[]>>
}

const ChatContext = createContext<ChatContextProps>({
      user: null,
      setUser: () => null,
      logout: () => null,
      selectedChat: null,
      setSelectedChat: () => null,
      chats: [],
      setChats: () => null
})


export const ChatState = () => {
      return useContext(ChatContext)
}

export default function ChatProvider ({ children }: { children: ReactNode }): JSX.Element {
      const [user, setUser] = useState(null)
      const [selectedChat, setSelectedChat] = useState(null)
      const [chats, setChats] = useState<IChat[]>([])

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
                  selectedChat,
                  chats,
                  setUser,
                  setSelectedChat,
                  setChats,
                  logout
            }),
            [user, logout, selectedChat, chats]
      )

      return (
            <ChatContext.Provider value={memoedValue}>
                  {children}
            </ChatContext.Provider>
      )
}

import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react"
import { userService } from "../services/user.service"
import { useNavigate } from "react-router-dom"
import { FormData } from "../model/user.model"

interface ChatContextProps {
      user: FormData | null
      setUser: React.Dispatch<React.SetStateAction<null>>
}

const ChatContext = createContext<ChatContextProps>({
      user: null,
      setUser: () => null
})


export const ChatState = () => {
      return useContext(ChatContext)
}

export default function ChatProvider ({ children }: { children: ReactNode }) {
      const [user, setUser] = useState(null)

      const navigate = useNavigate()

      useEffect(() => {
            const user = userService.getLoggedinUser()
            if (user) setUser(user)
            else navigate('/login')
      }, [navigate])

      const memoedValue = useMemo(
            () => ({ user, setUser }),
            [user, setUser]
      )

      return (
            <ChatContext.Provider value={memoedValue}>
                  {children}
            </ChatContext.Provider>
      )
}



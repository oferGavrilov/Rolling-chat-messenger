import { useState, useMemo, useEffect } from "react"
import { IChat } from "../../../model/chat.model"
import { chatService } from "../../../services/chat.service"
import { userService } from "../../../services/user.service"
import Loading from "../../Loading"
import { useChat } from "../../../store/useChat"
import MessagePreview from "./MessagePreview"

export default function MessageList () {
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const { chats, setChats } = useChat()
      const memoizedChats = useMemo(() => {
            return chats
      }, [chats])

      useEffect(() => {
            loadChats()
      }, [])

      async function loadChats (): Promise<void> {
            setIsLoading(true)
            const user = await userService.getLoggedinUser()
            const chats = await chatService.getUserChats(user._id)
            setChats(chats)
            setIsLoading(false)
      }
      return (
            // <div className="overflow-y-auto h-[82vh]">
            <ul >
                  {!isLoading ? (memoizedChats.map((chat: IChat) => (
                        <MessagePreview key={chat._id} chat={chat} />
                  ))) : (<Loading type="messages" />)
                  }
            </ul>
            // </div>
      )
}

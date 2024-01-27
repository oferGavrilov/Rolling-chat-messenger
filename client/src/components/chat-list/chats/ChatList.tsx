import { useEffect } from "react"
import { IChat } from "../../../model/chat.model"
import useChat from "../../../context/useChat"

import { AuthState } from "../../../context/useAuth"
import socketService from "../../../services/socket.service"
import ChatPreview from "./ChatPreview"

export default function ChatList({ chats }: { chats: IChat[] }) {
      const { setChats } = useChat()
      const { user } = AuthState()

      useEffect(() => {
            if (!user) return

            socketService.on('new group', handleNewGroup)


            return () => {
                  socketService.off('new group', handleNewGroup)
            }
      }, [user])

      function handleNewGroup(chat: IChat) {
            setChats([chat, ...chats])
      }

      return (
            <div className="overflow-y-auto h-[79vh]">
                  <ul className="px-1">
                        {chats.map(chat => (
                              <ChatPreview key={chat._id} chat={chat} />
                        ))}
                  </ul>
            </div>
      )
}
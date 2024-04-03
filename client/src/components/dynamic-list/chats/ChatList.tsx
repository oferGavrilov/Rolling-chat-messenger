import { useEffect } from "react"
import { IChat } from "../../../model/chat.model"
import useStore from "../../../context/store/useStore"

import { AuthState } from "../../../context/useAuth"
import socketService from "../../../services/socket.service"
import { SocketOnEvents } from "../../../utils/socketEvents"

import ChatPreview from "./ChatPreview"

export default function ChatList({ chats }: { chats: IChat[] }) {
      const { setChats } = useStore()
      const { user } = AuthState()

      useEffect(() => {
            if (!user) return

            socketService.on(SocketOnEvents.NEW_GROUP_CREATED, handleNewGroup)

            return () => {
                  socketService.off(SocketOnEvents.NEW_GROUP_CREATED, handleNewGroup)
            }
      }, [user])

      function handleNewGroup(chat: IChat) {
            setChats([chat, ...chats])
      }

      return (
            <div className="overflow-y-auto h-[79vh]">
                  <ul className="pl-1">
                        {chats.map((chat: IChat) => (
                              <ChatPreview key={chat._id} chat={chat} />
                        ))}
                  </ul>
            </div>
      )
}

import { useEffect, useRef } from "react"
import { IChat } from "../../model/chat.model"
import useChat from "../../store/useChat"

import MessagePreview from "./ChatPreview"
import { IMessage } from '../../model/message.model'
import { AuthState } from "../../context/useAuth"
import socketService from "../../services/socket.service"

export default function ChatList ({ chats }: { chats: IChat[] }) {
      const { notification, addNotification, selectedChat, setChats, updateChat } = useChat()
      const { user } = AuthState()
      const isMountedRef = useRef<boolean>(false)


      useEffect(() => {
            if (!user) return

            socketService.on('new group', handleNewGroup)


            return () => {
                  socketService.off('new group', handleNewGroup)
            }
      }, [user])

      useEffect(() => {
            isMountedRef.current = true

            return () => {
                  isMountedRef.current = false
            }
      }, [])

      useEffect(() => {
            socketService.on("message received", (newMessage: IMessage) => {
                  console.log('new message received', newMessage)
                  if (isMountedRef.current) {
                        if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
                              const isChatExists = chats.find((chat) => chat._id === newMessage.chat._id)
                              if (!isChatExists) {
                                    setChats([newMessage.chat, ...chats])
                              }
                              addNotification(newMessage)
                              updateChat(newMessage)
                              document.title = `${notification.length > 0 ? `(${notification.length})` : ""} Rolling`
                        }
                  }
            })

            return () => {
                  socketService.off("message received")
            }
      }, [selectedChat])

      function handleNewGroup (chat: IChat) {
            setChats([chat, ...chats])
      }
      return (
            <div className="overflow-y-auto h-[79vh]">
                  <ul className="px-1">
                        {chats.map(chat => (
                              <MessagePreview key={chat._id} chat={chat} notification={notification} />
                        ))}
                  </ul>
            </div>
      )
}

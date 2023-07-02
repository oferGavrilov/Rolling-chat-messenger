import { useEffect } from "react"
import { IChat } from "../../../model/chat.model"
import useChat from "../../../store/useChat"

import MessagePreview from "./MessagePreview"
import { Socket, io } from 'socket.io-client'
import { userService } from '../../../services/user.service'
import { IMessage } from '../../../model/message.model'

const ENDPOINT = 'http://localhost:5000'
let socket: Socket

export default function MessageList ({ chats }: { chats: IChat[] }) {
      const { notification, setNotification, selectedChatCompare, setChats } = useChat()

      useEffect(() => {
            const user = userService.getLoggedinUser()
            socket = io(ENDPOINT, { transports: ['websocket'] })
            socket.emit('setup', user._id)
            console.log('is connected!')
      }, [])

      useEffect(() => {
            socket.on('message received', handleNewMessage)

            return () => {
                  socket.off('message received', handleNewMessage)
            }
      }, [])

      function handleNewMessage (newMessage: IMessage) {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
                  setNotification(newMessage)
                  updateChat(newMessage, chats)
            }
            document.title = `${notification.length > 0 ? `(${notification.length})` : ''} Rolling`
      }

      function updateChat (latestMessage: IMessage, chats: IChat[]) {
            const chatIndex = chats.findIndex((chat) => chat._id === latestMessage.chat._id)
            if (chatIndex !== -1) {
                  const updatedChats = [...chats]
                  updatedChats[chatIndex] = { ...updatedChats[chatIndex], latestMessage }
                  const chat = updatedChats.splice(chatIndex, 1)[0]
                  updatedChats.unshift(chat)
                  setChats(updatedChats)
            }

      }

      return (
            <ul className="overflow-y-auto h-screen pb-48">
                  {chats.map(chat => (
                        <MessagePreview key={chat._id} chat={chat} />
                  ))}
            </ul>
      )
}

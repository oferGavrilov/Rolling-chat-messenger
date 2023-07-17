import { useEffect } from "react"
import { IChat } from "../../../model/chat.model"
import useChat from "../../../store/useChat"

import MessagePreview from "./MessagePreview"
import { Socket, io } from 'socket.io-client'
import { IMessage } from '../../../model/message.model'
import { AuthState } from "../../../context/useAuth"

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://rolling-2szg.onrender.com' : 'http://localhost:5000';
const socket: Socket = io(ENDPOINT, { transports: ['websocket'] });

export default function MessageList ({ chats }: { chats: IChat[] }) {
      const { notification, setNotification, selectedChat, setChats } = useChat()
      const { user } = AuthState()

      useEffect(() => {
            socket.emit('setup', user?._id);

            socket.on('new group', handleNewGroup);

            return () => {
                  socket.off('new group', handleNewGroup);
            };
      }, []);

      useEffect(() => {
            socket.on('message received', handleNewMessage)

            return () => {
                  socket.off('message received', handleNewMessage)
            }
      }, [selectedChat])

      useEffect(() => {
      }, [])

      function handleNewGroup (chat: IChat) {
            setChats([chat, ...chats])
      }

      function handleNewMessage (newMessage: IMessage) {
            if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
                  // console.log('newMessage notification', newMessage)
                  const isChatExists = chats.find(chat => chat._id === newMessage.chat._id)
                  if (!isChatExists) setChats([newMessage.chat, ...chats])
                  
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
            <ul className="overflow-y-auto h-screen pb-48 px-1">
                  {chats.map(chat => (
                        <MessagePreview key={chat._id} chat={chat} />
                  ))}
            </ul>
      )
}

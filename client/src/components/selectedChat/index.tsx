import { useEffect, useRef, useState } from "react"

import { AuthState } from "../../context/useAuth"
import useChat from "../../store/useChat"

import ChatHeader from "./chat/ChatHeader"
import Info from "./info/Index"
import Chat from "./chat/Chat"
import FileEditor from "./file/FileEditor"

import { formatLastSeenDate } from "../../utils/functions"

import socketService, { SOCKET_LOGIN, SOCKET_LOGOUT } from "../../services/socket.service"
import { chatService } from "../../services/chat.service"

import { IMessage } from "../../model/message.model"
import { IUser } from "../../model/user.model"

export default function Messenger (): JSX.Element {
      const [conversationUser, setConversationUser] = useState<IUser | null>(null)
      const [chatMode, setChatMode] = useState<"chat" | "info" | "send-file">('chat')
      const [isTyping, setIsTyping] = useState<boolean>(false)
      const [messages, setMessages] = useState<IMessage[]>([])

      const { selectedChat, addNotification, updateChat, chats, setChats } = useChat()
      const { user: loggedInUser } = AuthState()

      const [connectionStatus, setConnectionStatus] = useState<string>('')
      const [file, setFile] = useState<File | null>(null)

      const conversationUserRef = useRef<IUser | undefined>(undefined)

      useEffect(() => {
            socketService.on(SOCKET_LOGIN, handleConnection, true)
            socketService.on(SOCKET_LOGOUT, handleConnection, false)

            return () => {
                  socketService.off(SOCKET_LOGIN, handleConnection)
                  socketService.off(SOCKET_LOGOUT, handleConnection)
            }
      }, [])


      useEffect(() => {
            socketService.on('message received', (newMessage: IMessage) => {
                  if (selectedChat?._id !== newMessage.chat._id) {
                        console.log(newMessage)
                        addNotification(newMessage)
                        return
                  }

                  setMessages((prevMessages) => [...prevMessages, newMessage])

                  updateChat(newMessage)

            })

            return () => {
                  socketService.off('message received')
            }
      })

      useEffect(() => {
            fetchConversationUser()
            // setChatMode('chat')
      }, [selectedChat])

      async function fetchMessages () {
            if (!selectedChat) return
            const data = await chatService.getMessages(selectedChat._id)
            setMessages(data)
      }

      function fetchConversationUser (): void {
            const conversationUser = selectedChat?.users.find((user) => user._id !== loggedInUser?._id) || selectedChat?.users[0]
            if (conversationUser) {
                  setConversationUser(conversationUser)
                  conversationUserRef.current = conversationUser
            }
      }

      useEffect(() => {
            async function getConversationUserConnection () {
                  if (!conversationUser) return
                  const status = conversationUser.isOnline ? 'Online' : `Last seen ${formatLastSeenDate(conversationUser?.lastSeen as string)}`
                  setConnectionStatus(status)
            }

            getConversationUserConnection()
      }, [conversationUser])


      function handleConnection (userId: string, status: boolean): void {
            if (userId !== conversationUserRef.current?._id) return

            if (conversationUserRef.current) {
                  setConnectionStatus(
                        status ? 'Online' : `Last seen ${formatLastSeenDate(conversationUserRef.current?.lastSeen as string)}`
                  )
            }
      }

      async function onSendMessage (message: string | File, messageType: "text" | "image" | "audio" | "file", recordTimer?: number): Promise<void> {
            console.log('recordTimer', recordTimer)            
            if (!selectedChat || !message) return

            const optimisticMessage: IMessage = {
                  _id: 'temp-id',
                  sender: loggedInUser!,
                  messageType,
                  content: message,
                  chat: selectedChat,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  messageSize: recordTimer !== undefined ? Math.floor(recordTimer) : undefined,
            }

            // Show the message immediately 
            setMessages([...messages, optimisticMessage])
            setChatOnTop(optimisticMessage)

            try {
                  socketService.emit('stop typing', selectedChat._id)

                  const messageToUpdate = await chatService.sendMessage({
                        content: message,
                        chatId: selectedChat._id,
                        messageType: messageType,
                        messageSize: recordTimer !== undefined ? Math.floor(recordTimer) : undefined,
                  })

                  setMessages((prevMessages) =>
                        prevMessages.map((message) => (message._id === 'temp-id' ? messageToUpdate : message))
                  )
                  socketService.emit('new message', messageToUpdate)

            } catch (error) {
                  console.error('Failed to send message:', error)
                  setMessages([...messages])
            } finally {
                  if (chatMode !== 'chat') setChatMode('chat')
            }
      }

      function setChatOnTop (message: IMessage) {
            const chatToUpdateIndex = chats.findIndex((chat) => chat._id === message.chat._id)

            if (chatToUpdateIndex !== -1) {
                  const updatedChats = [...chats]
                  const updatedChat = {
                        ...updatedChats[chatToUpdateIndex],
                        latestMessage: message,
                  }
                  updatedChats.splice(chatToUpdateIndex, 1)
                  updatedChats.unshift(updatedChat)
                  setChats([...updatedChats])
            }
      }

      if (!selectedChat) return <div></div>
      return (
            <section className='flex-1 messenger-grid slide-left overflow-y-hidden max-h-screen'>

                  <ChatHeader
                        isTyping={isTyping}
                        connectionStatus={connectionStatus}
                        conversationUser={conversationUser}
                        setChatMode={setChatMode}

                  />

                  {chatMode === 'chat' && (
                        <Chat
                              setFile={setFile}
                              setChatMode={setChatMode}
                              setIsTyping={setIsTyping}
                              messages={messages}
                              setMessages={setMessages}
                              fetchMessages={fetchMessages}
                              onSendMessage={onSendMessage}
                              setChatOnTop={setChatOnTop}
                        />
                  )}
                  {chatMode === 'info' && (
                        <Info
                              conversationUser={conversationUser}
                              messages={messages}
                              setChatMode={setChatMode}
                        />
                  )}
                  {chatMode === 'send-file' && (
                        <FileEditor
                              file={file}
                              setChatMode={setChatMode}
                              sendMessage={onSendMessage}
                        />
                  )}
            </section>
      )
}

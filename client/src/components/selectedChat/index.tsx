import { useEffect, useRef, useState } from "react"

import { AuthState } from "../../context/useAuth"
import useChat from "../../store/useChat"

import ChatHeader from "./chat/ChatHeader"
import Info from "./info/Index"
import Chat from "./chat/Chat"
import FileEditor from "./file/FileEditor"
import TextPanel from "./chat/TextPanel"

import { formatLastSeenDate } from "../../utils/functions"

import socketService, { SOCKET_LOGIN, SOCKET_LOGOUT } from "../../services/socket.service"
import { chatService } from "../../services/chat.service"

import { IMessage } from "../../model/message.model"
import { IUser } from "../../model/user.model"
import { userService } from "../../services/user.service"
import { IChat } from "../../model/chat.model"

export default function Messenger (): JSX.Element {
      const [conversationUser, setConversationUser] = useState<IUser | null>(null)
      const [chatMode, setChatMode] = useState<"chat" | "info" | "send-file">('chat')

      const [messages, setMessages] = useState<IMessage[]>([])

      const { selectedChat, setSelectedChat, addNotification, updateChat, chats, setChats } = useChat()
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
            const handleKickUser = (chatId: string, userId: string, kickerId: string, chat: IChat | null) => {
                  if (chat?._id === chatId) {
                        if (!selectedChat) return
                        const updatedChat = {
                              ...selectedChat,
                              kickedUsers: [...selectedChat.kickedUsers, { userId, kickedBy: kickerId, kickedAt: new Date().toString() }],
                              users: selectedChat.users.filter(user => user._id !== userId)
                        }
                        isKicked()
                        setSelectedChat(updatedChat)
                  }
            }

            const handleAddUser = (chatId: string, user: IUser, chat: IChat | null) => {
                  if (chat?._id !== chatId) return
                  if (!selectedChat) return
                  const updatedChat = {
                        ...selectedChat,
                        kickedUsers: selectedChat.kickedUsers.filter(kickedUser => kickedUser.userId !== user._id),
                        users: [...selectedChat.users, user]
                  }
                  isKicked()
                  setSelectedChat(updatedChat)
            }

            const handleLeftUser = (chatId: string, userId: string, chat: IChat | null) => {
                  if (chat?._id !== chatId) return
                  if (!selectedChat) return
                  const updatedChat = {
                        ...selectedChat,
                        users: selectedChat.users.filter(chatUser => chatUser._id !== userId)
                  }
                  setSelectedChat(updatedChat)
            }

            socketService.on('user-kicked', ({ chatId, userId, kickerId }) => handleKickUser(chatId, userId, kickerId, selectedChat))
            socketService.on('user-joined', ({ chatId, user }) => handleAddUser(chatId, user, selectedChat))
            socketService.on('user-left', ({ chatId, userId }) => handleLeftUser(chatId, userId, selectedChat))

            return () => {
                  socketService.off('user-kicked')
                  socketService.off('user-joined')
                  socketService.off('user-left')
            }
      }, [selectedChat])

      useEffect(() => {
            fetchConversationUser()
            setChatMode('chat')
      }, [selectedChat?._id])

      async function fetchMessages () {
            if (!selectedChat) return
            if (selectedChat._id === 'temp-id') return setMessages([])
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
                  let chatToUpdate: IChat | undefined
                  // Chats that are not created yet have _id = 'temp-id'
                  if (selectedChat._id === 'temp-id') {
                        const targetUser: string = selectedChat.users.find((user) => user._id !== loggedInUser?._id)?._id as string
                        chatToUpdate = await userService.createChat(targetUser)
                        if (!chatToUpdate) throw new Error('Failed to create chat')
                        chatToUpdate.latestMessage = optimisticMessage
                        setChats([chatToUpdate, ...chats])
                  }

                  const messageToUpdate = await chatService.sendMessage({
                        content: message,
                        chatId: selectedChat._id !== 'temp-id' ? selectedChat._id : chatToUpdate?._id as string,
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

      function isKicked (): boolean {
            return selectedChat?.kickedUsers.some(kickedUser => kickedUser.userId === loggedInUser?._id) as boolean
      }

      if (!selectedChat) return <div></div>
      return (
            <section className='flex-1 messenger-grid slide-left overflow-y-hidden max-h-screen'>

                  <ChatHeader
                        connectionStatus={connectionStatus}
                        conversationUser={conversationUser}
                        setChatMode={setChatMode}
                  />

                  {chatMode === 'chat' && (
                        <Chat
                              setChatMode={setChatMode}
                              messages={messages}
                              fetchMessages={fetchMessages}
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

                  {(chatMode === 'chat'&& !isKicked()) && (
                        <TextPanel
                              onSendMessage={onSendMessage}
                              setFile={setFile}
                              setChatMode={setChatMode}
                        />
                  )}

            </section>
      )
}

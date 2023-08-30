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

import { IMessage, IReplyMessage } from "../../model/message.model"
import { IUser } from "../../model/user.model"
import { IChat, IFile } from "../../model/chat.model"
import { messageService } from "../../services/message.service"

export default function Messenger (): JSX.Element {
      const [conversationUser, setConversationUser] = useState<IUser | null>(null)
      const [chatMode, setChatMode] = useState<"chat" | "info" | "send-file">('chat')

      const [messages, setMessages] = useState<IMessage[]>([])

      const { selectedChat, setSelectedChat, addNotification, updateChat, chats, setChats, setReplyMessage } = useChat()
      const { user: loggedInUser } = AuthState()

      const [connectionStatus, setConnectionStatus] = useState<string>('')
      const [file, setFile] = useState<IFile | null>(null)

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
            socketService.on('message removed', ({ messageId, userId }: { messageId: string, userId: string }) => {
                  console.log('message removed', messageId, userId)
                  setSelectedChat({ ...selectedChat } as IChat)
                  // const isLastMessage = messages.length > 0 && messages[messages.length - 1]._id === messageId;

            })

            return () => {
                  socketService.off('message removed')
            }
      }, [messages])

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

            fetchConversationUser()

            return () => {
                  socketService.off('user-kicked')
                  socketService.off('user-joined')
                  socketService.off('user-left')
            }
      }, [selectedChat])

      useEffect(() => {
            setChatMode('chat')
      }, [selectedChat])

      useEffect(() => {
            async function getConversationUserConnection () {
                  if (!conversationUser) return
                  const status = conversationUser.isOnline ? 'Online' : `Last seen ${formatLastSeenDate(conversationUser?.lastSeen as string)}`
                  setConnectionStatus(status)
            }

            getConversationUserConnection()
      }, [conversationUser])

      async function fetchMessages () {
            if (!selectedChat) return
            if (selectedChat._id === 'temp-id') return setMessages([])
            try {
                  const data = await messageService.getMessages(selectedChat._id)
                  setMessages(data)
            } catch (error) {
                  console.error('Failed to fetch messages:', error)
            }
      }

      function fetchConversationUser (): void {
            const conversationUser = selectedChat?.users.find((user) => user._id !== loggedInUser?._id) || selectedChat?.users[0]
            if (conversationUser) {
                  setConversationUser(conversationUser)
                  conversationUserRef.current = conversationUser
            }
      }

      function handleConnection (userId: string, status: boolean): void {
            if (userId !== conversationUserRef.current?._id) return

            if (conversationUserRef.current) {
                  const date = new Date()
                  setConnectionStatus(
                        status ? 'Online' : `Last seen ${formatLastSeenDate(date.toString())}`
                  )
            }
      }

      async function onSendMessage (
            message: string | File,
            messageType: "text" | "image" | "audio" | "file",
            replyMessage: IReplyMessage | null,
            recordTimer?: number | undefined
      ): Promise<void> {
            if (!selectedChat || !message) return

            const optimisticMessage: IMessage = {
                  _id: 'temp-id',
                  sender: loggedInUser!,
                  messageType,
                  content: message,
                  chat: selectedChat,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  replyMessage,
                  messageSize: recordTimer !== undefined ? Math.floor(recordTimer) : undefined,
                  deletedBy: []
            }

            // Show the message immediately
            setReplyMessage(null)
            setMessages([...messages, optimisticMessage])
            setChatOnTop(optimisticMessage)

            try {
                  let chatToUpdate: IChat | undefined
                  // Chats that are not created yet have _id = 'temp-id'
                  if (selectedChat._id === 'temp-id') {
                        const targetUser: string = selectedChat.users.find((user) => user._id !== loggedInUser?._id)?._id as string
                        chatToUpdate = await chatService.createChat(targetUser)
                        if (!chatToUpdate) throw new Error('Failed to create chat')
                        chatToUpdate.latestMessage = optimisticMessage
                        setChats([chatToUpdate, ...chats])
                  }

                  const messageToUpdate = await messageService.sendMessage({
                        content: message,
                        chatId: selectedChat._id !== 'temp-id' ? selectedChat._id : chatToUpdate?._id as string,
                        messageType: messageType,
                        replyMessage,
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

      async function onRemoveMessage (message: IMessage) {
            try {
                  await messageService.removeMessage(message._id, selectedChat?._id as string)
                  setMessages(messages.filter((msg) => msg._id !== message._id))

                  socketService.emit('message-removed', { messageId: message._id, chatId: selectedChat?._id, chatUsers: selectedChat?.users })
                  console.log('Message removed')

            } catch (error) {
                  console.log(error)
            }
      }

      function isKicked (): boolean {
            if (!selectedChat) return false
            return selectedChat?.kickedUsers?.some(kickedUser => kickedUser.userId === loggedInUser?._id) as boolean
      }

      if (!selectedChat) return <div></div>
      return (
            <section className='flex-1 grid h-full overflow-hidden slide-left max-h-screen' style={{ gridTemplateRows: chatMode === 'chat' ? '64px 1fr 64px' : '64px 1fr' }}>

                  <ChatHeader
                        connectionStatus={connectionStatus}
                        conversationUser={conversationUser}
                        setChatMode={setChatMode}
                  />

                  {chatMode === 'chat' && (
                        <Chat
                              setChatMode={setChatMode}
                              messages={messages}
                              onRemoveMessage={onRemoveMessage}
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

                  {(chatMode === 'chat' && !isKicked()) && (
                        <TextPanel
                              onSendMessage={onSendMessage}
                              setFile={setFile}
                              setChatMode={setChatMode}
                        />
                  )}

            </section>
      )
}

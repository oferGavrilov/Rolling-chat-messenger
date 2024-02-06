import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { AuthState } from "../../context/useAuth"
import useStore from "../../context/store/useStore"

// import ChatHeader from "./chat/ChatHeader"
// import Info from "./info/Index"
// import Chat from "./chat/Chat"
// import FileEditor from "./file/FileEditor"
// import TextPanel from "./chat/TextPanel"

const ChatHeader = lazy(() => import("./chat/ChatHeader"));
const Info = lazy(() => import("./info/Index"));
const Chat = lazy(() => import("./chat/Chat"));
const FileEditor = lazy(() => import("./file/FileEditor"));
const TextPanel = lazy(() => import("./chat/TextPanel"));

import socketService from "../../services/socket.service"
import { chatService } from "../../services/chat.service"

import { IMessage, IReplyMessage } from "../../model/message.model"
import { IUser } from "../../model/user.model"
import { IChat, IFile } from "../../model/chat.model"
import { messageService } from "../../services/message.service"
import Loading from "../Loading";

export default function ChatInterface(): JSX.Element {
      const [conversationUser, setConversationUser] = useState<IUser | null>(null)
      const [chatMode, setChatMode] = useState<"chat" | "info" | "send-file">('chat')
      const [file, setFile] = useState<IFile | string | null>(null)
      const { selectedChat, setSelectedChat, updateChatWithLatestMessage, chats, setChats, setReplyMessage, messages, setMessages, removeMessage, bringChatToTop } = useStore()
      const { user: loggedInUser } = AuthState()

      const conversationUserRef = useRef<IUser | null>(null)

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

            const handleRemoveMessage = (messageId: string, chatId: string, removerId: string) => {
                  removeMessage(messageId, chatId, removerId);
            }

            socketService.on('user-kicked', ({ chatId, userId, kickerId }) => handleKickUser(chatId, userId, kickerId, selectedChat))
            socketService.on('user-joined', ({ chatId, user }) => handleAddUser(chatId, user, selectedChat))
            socketService.on('user-left', ({ chatId, userId }) => handleLeftUser(chatId, userId, selectedChat))
            socketService.on('message removed', ({ messageId, chatId, removerId }) => handleRemoveMessage(messageId, chatId, removerId))

            fetchConversationUser()
            setChatMode('chat')

            return () => {
                  socketService.off('user-kicked')
                  socketService.off('user-joined')
                  socketService.off('user-left')
                  socketService.off('message removed')
            }
      }, [selectedChat])

      useEffect(() => {
            socketService.on('message received', (newMessage: IMessage) => {
                  setMessages((prevMessages) => [...prevMessages, newMessage])
                  updateChatWithLatestMessage(newMessage)
            })

            return () => {
                  socketService.off('message received')
            }
      }, [selectedChat])

      function fetchConversationUser(): void {
            const conversationUser = selectedChat?.users.find((user) => user._id !== loggedInUser?._id) || selectedChat?.users[0]
            if (conversationUser) {
                  setConversationUser(conversationUser)
                  conversationUserRef.current = conversationUser
            }
      }

      async function onSendMessage(
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
                  chatId: selectedChat._id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  replyMessage,
                  messageSize: recordTimer !== undefined ? Math.floor(recordTimer) : undefined,
                  deletedBy: [],
                  isReadBy: [{ userId: loggedInUser?._id as string, readAt: new Date() }],
            }

            // Show the message immediately
            setReplyMessage(null)
            setMessages([...messages, optimisticMessage])
            bringChatToTop(optimisticMessage)

            try {
                  let chatToUpdate: IChat | undefined
                  // Chats that are not created yet have _id = 'temp-id'
                  if (selectedChat._id === 'temp-id') {
                        const targetUser: string = selectedChat.users.find((user) => user._id !== loggedInUser?._id)?._id as string
                        chatToUpdate = await chatService.createChat(targetUser)
                        if (!chatToUpdate) throw new Error('Failed to create chat')
                        setSelectedChat(chatToUpdate)
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

                  socketService.emit('new message in room', { chatId: selectedChat._id, message: messageToUpdate, chatUsers: selectedChat.users })

            } catch (error) {
                  console.error('Failed to send message:', error)
                  setMessages([...messages])
            } finally {
                  if (chatMode !== 'chat') setChatMode('chat')
            }
      }

      function isKicked(): boolean {
            if (!selectedChat) return false
            return selectedChat?.kickedUsers?.some(kickedUser => kickedUser.userId === loggedInUser?._id) as boolean
      }

      if (!selectedChat) return <div></div>
      return (
            <Suspense fallback={<Loading />}>
                  <section className='flex-1 grid h-full overflow-hidden slide-left max-h-screen' style={{ gridTemplateRows: chatMode === 'chat' ? '64px 1fr 64px' : '64px 1fr' }}>

                        <ChatHeader
                              conversationUser={conversationUser}
                              chatMode={chatMode}
                              setChatMode={setChatMode}
                              conversationUserRef={conversationUserRef}
                        />

                        {chatMode === 'chat' && (
                              <Chat
                                    setChatMode={setChatMode}
                                    messages={messages}
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
            </Suspense>
      )
}

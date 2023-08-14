import { useEffect, useRef, useState } from "react"
import { AuthState } from "../../context/useAuth"
import { IUser } from "../../model/user.model"
import useChat from "../../store/useChat"
import Info from "./info/Index"
import Chat from "./chat/Chat"

import { Avatar } from "@mui/material"
import { BsCameraVideo } from 'react-icons/bs'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { IoIosArrowBack } from 'react-icons/io'
import { formatLastSeenDate } from "../../utils/functions"
import FileEditor from "./file/FileEditor"
import socketService, { SOCKET_LOGIN, SOCKET_LOGOUT } from "../../services/socket.service"
import { chatService } from "../../services/chat.service"
import { IMessage } from "../../model/message.model"

export default function Messenger (): JSX.Element {
      const [conversationUser, setConversationUser] = useState<IUser>()
      const [chatMode, setChatMode] = useState<string>('chat')
      const [isTyping, setIsTyping] = useState<boolean>(false)
      const [messages, setMessages] = useState<IMessage[]>([])

      const { selectedChat, setSelectedChat, addNotification, updateChat, setChatOnTop } = useChat()
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
            if (!selectedChat) return

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

      if (!selectedChat) return <div></div>
      return (
            <section className='flex-1 messenger slide-left overflow-y-hidden dark:bg-dark-secondary-bg'>
                  <div className='flex items-center px-2 h-16 z-10 chat-header-shadow md:h-[4.4rem]'>
                        <IoIosArrowBack size={30} className='md:hidden text-primary dark:text-dark-primary-text mr-3 cursor-pointer' onClick={() => setSelectedChat(null)} />
                        <Avatar className="hover:scale-110 transition-all duration-300 cursor-pointer" src={selectedChat.isGroupChat ? selectedChat.groupImage : conversationUser?.profileImg} alt={conversationUser?.username} onClick={() => setChatMode('info')} />
                        <div className='flex items-center gap-4 ml-4 justify-between w-full'>
                              <div className='flex flex-col'>
                                    <h2 className='md:text-lg font-semibold cursor-pointer dark:text-dark-primary-text underline-offset-2 hover:underline' onClick={() => setChatMode('info')}>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
                                    {!selectedChat.isGroupChat ?
                                          <span className='text-primary dark:text-dark-primary-text text-xs md:text-base'>
                                                {isTyping ? 'Typing...' : connectionStatus}
                                          </span> : (
                                                <div className="flex gap-x-1 text-xs tracking-wide">
                                                      {selectedChat.users.map((user, index) =>
                                                            <span key={user._id} className="text-slate-400 dark:text-slate-200">
                                                                  {user._id === loggedInUser?._id ? 'You' : user.username}
                                                                  {index !== selectedChat.users.length - 1 && ","}
                                                            </span>
                                                      )}
                                                </div>
                                          )}
                              </div>
                              <div className='flex items-center gap-x-2'>
                                    <div className='text-primary dark:text-dark-primary-text text-2xl hover:bg-gray-100 dark:hover:bg-dark-tertiary-bg py-2 px-2 rounded-lg cursor-pointer'>
                                          <BsCameraVideo />
                                    </div>
                                    <div className='text-gray-500 dark:text-dark-primary-text hover:bg-gray-100 dark:hover:bg-dark-tertiary-bg text-2xl py-2 px-1 rounded-lg cursor-pointer' onClick={() => setChatMode('info')}>
                                          <AiOutlineInfoCircle />
                                    </div>
                              </div>
                        </div>
                  </div>
                  {chatMode === 'chat' && (
                        <Chat
                              setFile={setFile}
                              setChatMode={setChatMode}
                              setIsTyping={setIsTyping}
                              messages={messages}
                              setMessages={setMessages}
                              fetchMessages={fetchMessages}
                              onSendMessage={onSendMessage}
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

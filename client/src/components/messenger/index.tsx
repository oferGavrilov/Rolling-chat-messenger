import { useEffect, useState } from "react"
import { AuthState } from "../../context/useAuth"
import { User } from "../../model/user.model"
import useChat from "../../store/useChat"
import Info from "./info/Index"
import Chat from "./chat/Chat"

import { Avatar } from "@mui/material"
import { BsCameraVideo } from 'react-icons/bs'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { IoIosArrowBack } from 'react-icons/io'
import { Socket, io } from 'socket.io-client'
import { formatLastSeenDate } from "../../utils/functions"

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://rolling-948m.onrender.com/' : 'http://localhost:5000'
const socket: Socket = io(ENDPOINT, { transports: ['websocket'] })

export default function Messenger ({ setShowSearch }: { setShowSearch: React.Dispatch<React.SetStateAction<boolean>> }) {

      const [conversationUser, setConversationUser] = useState<User>()
      const [isChatMode, setMode] = useState<boolean>(true)
      const [isTyping, setIsTyping] = useState<boolean>(false)

      const { selectedChat, setSelectedChat, chats, setChats } = useChat()
      const { user: loggedInUser } = AuthState()

      useEffect(() => {
            socket.on('login', (userId: string) => handleConnection(userId, true))
            socket.on('logout', (userId) => handleConnection(userId, false))

            return () => {
                  socket.off('login', handleConnection)
                  socket.off('logout', handleConnection)
            }
      }, [])

      const getConversationUser = (): User | undefined => {
            return selectedChat?.users.find(user => user._id !== loggedInUser?._id) || selectedChat?.users[0]
      }

      useEffect(() => {
            if (selectedChat) {
                  const user = getConversationUser()
                  setConversationUser(user)
            }
      }, [selectedChat])

      const handleConnection = (userId: string, status: boolean) => {
            const chatToUpdate = chats.find(chat => chat._id === selectedChat?._id)

            if (chatToUpdate) {
                  const updatedUsers = chatToUpdate.users.map(user => {
                        if (user?._id === userId) {
                              return { ...user, isOnline: status }
                        }
                        return user
                  })
                  if (!status) {
                        const userToUpdate = updatedUsers.find(user => user?._id === userId)
                        if (userToUpdate) {
                              userToUpdate.lastSeen = new Date().toISOString()
                        }
                  }
                  const updatedChats = [...chats]
                  const chatIndex = updatedChats.findIndex(chat => chat._id === chatToUpdate._id)
                  if (chatIndex !== -1) {
                        updatedChats[chatIndex] = { ...chatToUpdate, users: updatedUsers }
                        setChats(updatedChats)
                  }
            }

            if (conversationUser?._id === userId || !status) {
                  setConversationUser(prev => {
                        if (!prev) return prev
                        return { ...prev, isOnline: status, lastSeen: !status ? new Date().toISOString() : prev.lastSeen }
                  })
            }
      }

      function getConversationUserConnection (): string {
            if (!conversationUser) return ''
            return conversationUser?.isOnline ? 'Online' : `Last seen ${formatLastSeenDate(conversationUser.lastSeen as string)}`
      }

      // TODO: Check if user is Online on mount

      if (!selectedChat) return null
      return (
            <section className='flex-1 messenger slide-left overflow-y-hidden '>
                  <div className='flex items-center px-2 h-16 md:h-20'>
                        <IoIosArrowBack size={30} className='md:hidden text-blue-400 mr-3 cursor-pointer' onClick={() => setSelectedChat(null)} />
                        <Avatar className="hover:scale-110 transition-all duration-300 cursor-pointer" src={selectedChat.isGroupChat ? selectedChat.groupImage : conversationUser?.profileImg} alt={conversationUser?.username} onClick={() => setMode(false)} />
                        <div className='flex items-center gap-4 ml-4 justify-between w-full'>
                              <div className='flex flex-col'>
                                    <h2 className='md:text-lg font-semibold cursor-pointer underline-offset-2 hover:underline' onClick={() => setMode(false)}>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
                                    {!selectedChat.isGroupChat ? <span className='text-primary text-xs md:text-base'>{isTyping ? 'Typing...' : getConversationUserConnection()}</span> : (
                                          <div className="flex gap-x-1 text-xs tracking-wide">
                                                {selectedChat.users.map((user, index) =>
                                                      <span key={user._id} className="text-slate-400">
                                                            {user.username}
                                                            {index !== selectedChat.users.length - 1 && ","}
                                                      </span>
                                                )}
                                          </div>
                                    )}
                              </div>
                              <div className='flex items-center gap-x-2'>
                                    <div className='text-primary text-2xl hover:bg-gray-100 py-2 px-2 rounded-lg cursor-pointer'>
                                          <BsCameraVideo />
                                    </div>
                                    <div className='text-gray-500 hover:bg-gray-100 text-2xl py-2 px-1 rounded-lg cursor-pointer' onClick={() => setMode(!isChatMode)}>
                                          <AiOutlineInfoCircle />
                                    </div>
                              </div>
                        </div>
                  </div>
                  {isChatMode ? <Chat isTyping={isTyping} setIsTyping={setIsTyping} /> :
                        <Info conversationUser={conversationUser} setMode={setMode} setShowSearch={setShowSearch} />}
            </section>
      )
}
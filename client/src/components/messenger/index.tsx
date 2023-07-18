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
import { userService } from "../../services/user.service"

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://rolling-948m.onrender.com/' : 'http://localhost:5000'
const socket: Socket = io(ENDPOINT, { transports: ['websocket'] })

export default function Messenger ({ setShowSearch }: { setShowSearch: React.Dispatch<React.SetStateAction<boolean>> }) : JSX.Element{

      const [conversationUser, setConversationUser] = useState<User>()
      const [isChatMode, setMode] = useState<boolean>(true)
      const [isTyping, setIsTyping] = useState<boolean>(false)

      const { selectedChat, setSelectedChat } = useChat()
      const { user: loggedInUser } = AuthState()

      const [connectionStatus, setConnectionStatus] = useState<string>('')

      useEffect(() => {
            socket.on('login', (userId: string) => handleConnection(userId, true))
            socket.on('logout', (userId) => handleConnection(userId, false))

            return () => {
                  socket.off('login', handleConnection)
                  socket.off('logout', handleConnection)
            }
      }, [])

      useEffect(() => {
            fetchConversationUser();
      }, [selectedChat]);

      useEffect(() => {
            async function getConversationUserConnection () {
                  if (!conversationUser) return
                  const status = conversationUser.isOnline ? 'Online' : `Last seen ${formatLastSeenDate(conversationUser?.lastSeen as string)}`;
                  setConnectionStatus(status)
            }

            getConversationUserConnection();
      }, [conversationUser]);

      async function fetchConversationUser (): Promise<void> {
            const conversationUser = selectedChat?.users.find(user => user._id !== loggedInUser?._id) || selectedChat?.users[0]
            const users = await userService.getUsers(conversationUser?._id) as User
            setConversationUser(users[0])
      }

      const handleConnection = (userId: string, status: boolean) => {
            if (loggedInUser?._id === userId) return
            setConnectionStatus(status ? 'Online' : `Last seen ${formatLastSeenDate(conversationUser?.lastSeen as string)}`)
      }

      if (!selectedChat) return <div></div>
      return (
            <section className='flex-1 messenger slide-left overflow-y-hidden '>
                  <div className='flex items-center px-2 h-16 md:h-20'>
                        <IoIosArrowBack size={30} className='md:hidden text-blue-400 mr-3 cursor-pointer' onClick={() => setSelectedChat(null)} />
                        <Avatar className="hover:scale-110 transition-all duration-300 cursor-pointer" src={selectedChat.isGroupChat ? selectedChat.groupImage : conversationUser?.profileImg} alt={conversationUser?.username} onClick={() => setMode(false)} />
                        <div className='flex items-center gap-4 ml-4 justify-between w-full'>
                              <div className='flex flex-col'>
                                    <h2 className='md:text-lg font-semibold cursor-pointer underline-offset-2 hover:underline' onClick={() => setMode(false)}>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
                                    {!selectedChat.isGroupChat ?
                                          <span className='text-primary text-xs md:text-base'>
                                                {isTyping ? 'Typing...' : connectionStatus}
                                          </span> : (
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
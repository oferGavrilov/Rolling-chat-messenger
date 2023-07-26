import { useEffect, useRef, useState } from "react"
import { AuthState } from "../../context/useAuth"
import { User } from "../../model/user.model"
import useChat from "../../store/useChat"
import Info from "./info/Index"
import Chat from "./chat/Chat"

import { Avatar } from "@mui/material"
import { BsCameraVideo } from 'react-icons/bs'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { IoIosArrowBack } from 'react-icons/io'
import { formatLastSeenDate } from "../../utils/functions"
import FileEditor from "./FileEditor"
import socketService, { SOCKET_LOGIN, SOCKET_LOGOUT } from "../../services/socket.service"

export default function Messenger ({ setShowSearch }: { setShowSearch: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {

      const [conversationUser, setConversationUser] = useState<User>()
      const [chatMode, setChatMode] = useState<string>('chat')
      const [isTyping, setIsTyping] = useState<boolean>(false)

      const { selectedChat, setSelectedChat } = useChat()
      const { user: loggedInUser } = AuthState()

      const [connectionStatus, setConnectionStatus] = useState<string>('')
      const [file, setFile] = useState<File | null>(null)

      const conversationUserRef = useRef<User | undefined>(undefined);

      useEffect(() => {
            socketService.on(SOCKET_LOGIN, handleConnection, true)
            socketService.on(SOCKET_LOGOUT, handleConnection, false)

            return () => {
                  socketService.off('login', handleConnection)
                  socketService.off('logout', handleConnection)
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

      function fetchConversationUser (): void {
            const conversationUser = selectedChat?.users.find((user) => user._id !== loggedInUser?._id) || selectedChat?.users[0];
            if (conversationUser) {
                  setConversationUser(conversationUser);
                  conversationUserRef.current = conversationUser;
            }
      }

      function handleConnection (userId: string, status: boolean): void {
            if (loggedInUser?._id === userId) return;

            const conversationUser = conversationUserRef.current;
            if (conversationUser) {
                  setConnectionStatus(status ? 'Online' : `Last seen ${formatLastSeenDate(conversationUser?.lastSeen as string)}`);
            }
      }

      if (!selectedChat) return <div></div>
      return (
            <section className='flex-1 messenger slide-left overflow-y-hidden '>
                  <div className='flex items-center px-2 h-16 md:h-20'>
                        <IoIosArrowBack size={30} className='md:hidden text-blue-400 mr-3 cursor-pointer' onClick={() => setSelectedChat(null)} />
                        <Avatar className="hover:scale-110 transition-all duration-300 cursor-pointer" src={selectedChat.isGroupChat ? selectedChat.groupImage : conversationUser?.profileImg} alt={conversationUser?.username} onClick={() => setChatMode('info')} />
                        <div className='flex items-center gap-4 ml-4 justify-between w-full'>
                              <div className='flex flex-col'>
                                    <h2 className='md:text-lg font-semibold cursor-pointer underline-offset-2 hover:underline' onClick={() => setChatMode('info')}>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
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
                                    <div className='text-gray-500 hover:bg-gray-100 text-2xl py-2 px-1 rounded-lg cursor-pointer' onClick={() => setChatMode('info')}>
                                          <AiOutlineInfoCircle />
                                    </div>
                              </div>
                        </div>
                  </div>
                  {chatMode === 'chat' && <Chat isTyping={isTyping} setFile={setFile} setChatMode={setChatMode} setIsTyping={setIsTyping} />}
                  {chatMode === 'info' && <Info conversationUser={conversationUser} setChatMode={setChatMode} setShowSearch={setShowSearch} />}
                  {chatMode === 'send-file' && <FileEditor file={file} setChatMode={setChatMode} />}
            </section>
      )
}

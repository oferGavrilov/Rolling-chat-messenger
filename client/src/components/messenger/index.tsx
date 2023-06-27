import { useCallback, useEffect, useState } from "react"
import Chat from "./chat/Chat"
import { BsCameraVideo } from 'react-icons/bs'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { User } from "../../model/user.model"
import useChat from "../../store/useChat"
import Info from "./info/Info"
import { IoIosArrowBack } from 'react-icons/io'
import { Avatar } from "@mui/material"
import { AuthState } from "../../context/useAuth"


export default function Messenger ({ setShowSearch }: { setShowSearch: React.Dispatch<React.SetStateAction<boolean>> }) {

      const [conversationUser, setConversationUser] = useState<User>()
      const [isChatMode, setMode] = useState<boolean>(true)
      const [isTyping, setIsTyping] = useState<boolean>(false)

      const { selectedChat, setSelectedChat } = useChat()
      const { user: loggedInUser } = AuthState()

      const getConversationUser = useCallback((): User | undefined => {
            return selectedChat?.users.find(user => user._id !== loggedInUser?._id) || selectedChat?.users[0]
      }, [selectedChat, loggedInUser?._id])

      useEffect(() => {
            if (selectedChat) setConversationUser(getConversationUser())
            // setMode(true)
      }, [getConversationUser, selectedChat])
      
      return (
            <section className='flex-1 messenger slide-left overflow-y-hidden '>
                  <div className='flex items-center px-2 h-16 md:h-20'>
                        <IoIosArrowBack size={30} className='md:hidden text-blue-400 mr-3' onClick={() => setSelectedChat(null)} />
                        <Avatar className="hover:scale-110 transition-all duration-300 cursor-pointer" src={selectedChat.isGroupChat ? selectedChat.groupImage : conversationUser?.profileImg} alt={conversationUser?.username} onClick={() => setMode(false)} />
                        <div className='flex items-center gap-4 ml-4 justify-between w-full'>
                              <div className='flex flex-col'>
                                    <h2 className='md:text-lg font-semibold cursor-pointer underline-offset-2 hover:underline' onClick={() => setMode(false)}>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
                                    {!selectedChat.isGroupChat ? <span className='text-primary text-xs md:text-base'>{isTyping ? 'Typing...' : 'Online'}</span> : (
                                          <div className="flex gap-x-2 text-sm tracking-wide">
                                                {selectedChat.users.slice(0, 4).map(user =>
                                                      <span key={user._id} className="text-gray-400   ">
                                                            {user.username}
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

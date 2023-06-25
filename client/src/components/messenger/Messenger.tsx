import { useCallback, useEffect, useState } from "react"
import Chat from "./Chat"
import { BsCameraVideo } from 'react-icons/bs'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { User } from "../../model/user.model"
import { userService } from "../../services/user.service"
import useChat from "../../store/useChat"
import Info from "./info/Info"
import { IoIosArrowBack } from 'react-icons/io'


export default function Messenger ({ setShowSearch }: { setShowSearch: React.Dispatch<React.SetStateAction<boolean>> }) {
      const loggedinUser = userService.getLoggedinUser()
      const [conversationUser, setConversationUser] = useState<User>()
      const { selectedChat, setSelectedChat } = useChat()
      const [isChatMode, setMode] = useState<boolean>(true)

      const getConversationUser = useCallback((): User | undefined => {
            return selectedChat?.users.find(user => user._id !== loggedinUser?._id) || selectedChat?.users[0]
      }, [selectedChat, loggedinUser])

      useEffect(() => {
            if (selectedChat) setConversationUser(getConversationUser())
            // setMode(true)
      }, [selectedChat])

      return (
            <section className='flex-1 messenger slide-left overflow-y-hidden '>
                  <div className='flex items-center px-4 py-3'>
                        <IoIosArrowBack size={30} className='md:hidden text-blue-400 mr-3' onClick={() => setSelectedChat(null)} />
                        <img
                              src={selectedChat.isGroupChat ? selectedChat.groupImage : conversationUser?.profileImg}
                              alt={conversationUser?.username}
                              onClick={() => setMode(false)}
                              className='w-10 h-10 md:w-12 md:h-12 mr-4 rounded-full object-cover object-top cursor-pointer hover:scale-110 transition-all duration-300'
                        />
                        <div className='flex items-center gap-4  justify-between w-full'>
                              <div className='flex flex-col'>
                                    <h2 className='md:text-xl font-semibold cursor-pointer underline-offset-2 hover:underline' onClick={() => setMode(false)}>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
                                    {!selectedChat.isGroupChat ? <span className='text-primary text-xs md:text-base'>Online</span> : (
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
                                          <BsCameraVideo  />
                                    </div>
                                    <div className='text-gray-500 hover:bg-gray-100 text-2xl py-2 px-1 rounded-lg cursor-pointer' onClick={() => setMode(!isChatMode)}>
                                          <AiOutlineInfoCircle  />
                                    </div>
                              </div>
                        </div>
                  </div>
                  {isChatMode ? (<Chat />) : (<Info conversationUser={conversationUser} setMode={setMode} setShowSearch={setShowSearch} />)}
            </section>
      )
}

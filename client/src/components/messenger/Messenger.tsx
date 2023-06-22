import { useCallback, useEffect, useState } from "react"
import Chat from "./Chat"
import { BsCameraVideo } from 'react-icons/bs'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { User } from "../../model/user.model"
import { userService } from "../../services/user.service"
import useChat from "../../store/useChat"
import Info from "./info/Info"


export default function Messenger () {
      const loggedinUser = userService.getLoggedinUser()
      const [conversationUser, setConversationUser] = useState<User>()
      const { selectedChat } = useChat()
      const [mode, setMode] = useState<string>('chat')

      const getConversationUser = useCallback((): User | undefined => {
            return selectedChat?.users.find(user => user._id !== loggedinUser?._id) || selectedChat?.users[0]
      }, [selectedChat, loggedinUser])

      useEffect(() => {
            if (selectedChat) setConversationUser(getConversationUser())
            setMode('chat')
      }, [selectedChat])


      return (
            <section className='flex-1 messenger slide-left overflow-y-hidden'>
                  <div className='flex items-center p-4'>
                        <img src={selectedChat.isGroupChat ? selectedChat.groupImage : conversationUser?.profileImg} alt={conversationUser?.username} className='w-12 h-12 mr-5 rounded-full object-cover object-top' />
                        <div className='flex items-center gap-4  justify-between w-full'>
                              <div className='flex flex-col'>
                                    <h2 className='text-xl font-semibold'>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
                                    {!selectedChat.isGroupChat ? <span className='text-primary'>Online</span> : (
                                          <div className="flex gap-x-2 ">
                                                {selectedChat.users.slice(0,4).map(user =>
                                                      <span key={user._id} className="text-gray-400   ">
                                                            {user.username}
                                                      </span>
                                                )}
                                          </div>
                                    )}
                              </div>
                              <div className='flex items-center gap-x-2'>
                                    <div className='text-primary hover:bg-gray-100 py-3 px-2 rounded-lg cursor-pointer'>
                                          <BsCameraVideo size={25} />
                                    </div>
                                    <div className='text-gray-500 hover:bg-gray-100 p-3 rounded-lg cursor-pointer' onClick={() => setMode('info')}>
                                          <AiOutlineInfoCircle size={25} />
                                    </div>
                              </div>
                        </div>
                  </div>
                  {mode === 'chat' ? (<Chat />) : (<Info conversationUser={conversationUser} setMode={setMode} />)}
            </section>
      )
}

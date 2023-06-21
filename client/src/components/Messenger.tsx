import { useCallback, useEffect, useState } from 'react'
import { User } from '../model/user.model'
import { userService } from '../services/user.service'
import { BsCameraVideo } from 'react-icons/bs'
import { AiOutlineInfoCircle, AiOutlinePaperClip } from 'react-icons/ai'
import { IChat } from '../model/chat.model'

export default function Messenger ({ selectedChat }: { selectedChat: IChat }) {
      const loggedinUser = userService.getLoggedinUser()
      const [conversationUser, setConversationUser] = useState<User>()

      const getConversationUser = useCallback((): User | undefined => {
            return selectedChat?.users.find(user => user._id !== loggedinUser?._id) || selectedChat?.users[0];
      }, [selectedChat, loggedinUser]);

      useEffect(() => {
            if (selectedChat) setConversationUser(getConversationUser());
      }, [getConversationUser, selectedChat]);


      console.log('conversationUser', conversationUser)

      return (
            <section className='flex-1 messenger slide-left'>

                  <div className='flex items-center p-4'>
                        <img src={selectedChat.isGroupChat ? selectedChat.groupImage : conversationUser?.profileImg} alt={conversationUser?.username} className='w-12 h-11 mr-5 rounded-full object-cover' />
                        <div className='flex items-center gap-4  justify-between w-full'>
                              <div className='flex flex-col'>
                                    <h2 className='text-xl font-semibold'>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
                                    <span className='text-primary'>Online</span>
                              </div>
                              <div className='flex items-center gap-x-2'>
                                    <div className='text-primary hover:bg-gray-100 py-3 px-2 rounded-lg cursor-pointer'>
                                          <BsCameraVideo size={25} />
                                    </div>
                                    <div className='text-gray-500 hover:bg-gray-100 p-3 rounded-lg cursor-pointer'>
                                          <AiOutlineInfoCircle size={25} />
                                    </div>
                              </div>
                        </div>
                  </div>

                  <div className='bg-gray-100 border-y border-1 overflow-auto'>
                        chat
                  </div>

                  <div className='py-5 flex items-center px-5 gap-x-5'>
                        <div className='text-gray-500 px-3 hover:text-gray-600 cursor-pointer'>
                              <AiOutlinePaperClip size={25} />
                        </div>
                        <input
                              type="text"
                              className='bg-gray-100 px-4 w-full rounded-xl py-2 focus-visible:outline-none'
                              placeholder='Type a message...'
                        />
                        <button className='text-primary transition-colors duration-200 ease-in whitespace-nowrap hover:bg-primary hover:text-white p-2 rounded-lg'>Send message</button>
                  </div>
            </section>
      )
}

import React, { useCallback } from 'react'
import { useChat } from '../../../context/useChat'
import { IChat, IUser } from '../../../model/'
import { AuthState } from '../../../context/useAuth'
import { formatTime } from '../../../utils/functions'
import Avatar from '../../common/Avatar'
import LatestMessagePreview from './LatestMessagePreview'

const defaultUser: IUser = {
      _id: "default",
      username: "Unknown",
      email: "unknown@example.com",
      profileImg: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      about: "No Information",
      isOnline: false,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
}

const ChatPreview: React.FC<{ chat: IChat }> = ({ chat }) => {
      const { setSelectedChat, selectedChat } = useChat()
      const { user: loggedinUser } = AuthState()


      const getSender = useCallback(
            (users: IUser[]): IUser => {
                  const user = users.find((currUser) => currUser._id !== loggedinUser?._id)
                  return user || defaultUser
            },
            [loggedinUser?._id]
      )

      const handleSelectChat =() => {
            if(selectedChat?._id === chat._id) return
            
            let updatedChat = chat
            // for case the other user account has been deleted or removed from the system
            if (chat.users.length === 1) {
                  updatedChat = { ...chat, users: [...chat.users, defaultUser] }
            }
            setSelectedChat(updatedChat)
      }

      if (!loggedinUser) return null

      return (
            <li onClick={handleSelectChat}
                  className={`flex items-center rounded-l-lg rounded-r-md justify-between px-3 py-3 my-1 hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg cursor-pointer transition-colors duration-200 overflow-hidden
                   ${selectedChat?._id === chat._id && 'bg-gray-100 dark:bg-dark-secondary-bg border-r-4 border-r-primary'}`}>
                  <div className="flex items-center w-full">
                        <div className='h-[40px] w-[40px] lg:h-11 lg:w-11 overflow-hidden rounded-full select-none flex-shrink-0'>
                              <Avatar
                                    src={chat.isGroupChat ? (chat.groupImage || defaultUser.profileImg) : getSender(chat.users).profileImg}
                                    alt='profile-image'
                              />
                        </div>
                        <div className="ml-3 w-full">
                              <div className='flex justify-between items-center'>
                                    <h3 className="text-md font-bold">{chat.isGroupChat ? chat.chatName : getSender(chat.users).username}</h3>
                                    <span className='text-gray-400 dark:text-dark-primary-text text-sm'>
                                          {formatTime(chat.latestMessage ? chat?.latestMessage?.createdAt : chat.createdAt as string)}
                                    </span>
                              </div>
                              <div className='flex justify-between'>
                                    <LatestMessagePreview chat={chat} loggedinUser={loggedinUser} unreadMessagesCount={chat.unreadMessagesCount} selectedChat={selectedChat} />
                              </div>
                        </div>
                  </div>
            </li>
      )
}

export default React.memo(ChatPreview)


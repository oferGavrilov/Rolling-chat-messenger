import React, { useCallback } from 'react'
import useStore from '../../../context/store/useStore'
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
      TN_profileImg: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      about: "No Information",
      isOnline: false,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
}

const ChatPreview: React.FC<{ chat: IChat }> = ({ chat }) => {
      const { setSelectedChat, selectedChat, setMessages } = useStore()
      const { user: loggedInUser } = AuthState()

      const getSender = useCallback((users: IUser[]): IUser => {
            const user = users.find((currUser) => currUser._id !== loggedInUser?._id)
            return user || defaultUser
      }, [loggedInUser?._id])

      const handleSelectChat = useCallback(() => {
            if (selectedChat?._id === chat._id) return

            setMessages([]); // Clear the messages when a new chat is selected
            const updatedChat = getUpdatedChat(chat); // Add the logged in user to the chat if not already present
            setSelectedChat(updatedChat);

      }, [chat, selectedChat, setSelectedChat])

      const getUpdatedChat = (chat: IChat): IChat => {
            return chat.users.length === 1 ? { ...chat, users: [...chat.users, defaultUser] } : chat;
      };

      if (!loggedInUser) return null

      const isSelectedChat = selectedChat?._id === chat._id;
      const chatClassName = `flex items-center rounded-l-lg justify-between pl-3 pr-4 py-3 my-1 hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg cursor-pointer transition-colors duration-200 overflow-hidden ${isSelectedChat ? 'bg-gray-100 dark:bg-dark-secondary-bg selected-chat' : ''}`;

      return (
            <li
                  onClick={handleSelectChat}
                  className={chatClassName}
                  role='button'
                  tabIndex={0}
                  aria-label={`Select chat with ${chat.isGroupChat ? chat.chatName : getSender(chat.users).username}`}
            >
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
                              <div className='flex justify-between min-h-6'>
                                    <LatestMessagePreview chat={chat} loggedinUser={loggedInUser} unreadMessagesCount={chat.unreadMessagesCount} selectedChat={selectedChat} />
                              </div>
                        </div>
                  </div>
            </li>
      )
}

export default React.memo(ChatPreview)

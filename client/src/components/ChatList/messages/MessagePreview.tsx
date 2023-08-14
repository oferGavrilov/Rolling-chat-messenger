import { useCallback } from 'react'

import { useChat } from '../../../store/useChat'
import { Image, Audiotrack, Description } from '@mui/icons-material'

import { IChat } from '../../../model/chat.model'
import { IUser } from '../../../model/user.model'
import { IMessage } from '../../../model/message.model'

import { Avatar } from '@mui/material'
import { AuthState } from '../../../context/useAuth'
import { formatTime } from '../../../utils/functions'

interface Props {
      chat: IChat
      notification: IMessage[]
}

export default function MessagePreview ({ chat, notification }: Props) {
      const { setSelectedChat, selectedChat, removeNotification } = useChat()
      const { user: loggedinUser } = AuthState()

      const getSender = useCallback(
            (users: IUser[]): IUser => {
                  return users.find((currUser) => currUser._id !== loggedinUser?._id) || users[0]
            },
            [loggedinUser?._id]
      )

      function getLatestMessage (): React.ReactNode {
            let sender: string = ''
            let content: React.ReactNode = ''

            if (chat.latestMessage?.sender?._id === loggedinUser?._id) {
                  sender = 'you: '
            } else if (chat.isGroupChat && chat.latestMessage) {
                  sender = chat.latestMessage?.sender?.username + ': ' || ''
            }

            if (chat.latestMessage?.messageType === 'text') {
                  content = chat.latestMessage?.content?.toString()

            } else if (chat.latestMessage?.messageType === 'image') {
                  content = (
                        <>
                              Image <Image fontSize="small" className='content-preview' />
                        </>
                  )
            } else if (chat.latestMessage?.messageType === 'audio') {
                  content = (
                        <>
                              Audio <Audiotrack fontSize="small" className='content-preview' />
                        </>
                  )
            } else if (chat.latestMessage?.messageType === 'file') {
                  content = (
                        <>
                              File <Description fontSize="small" className='content-preview' />
                        </>
                  )
            }

            return (
                  <>
                        {sender}
                        {content}
                  </>
            )
      }

      function isNotification (): boolean {
            const notificationChat = getCurrentNotificationChat()
            return notificationChat && notificationChat?.sender._id !== loggedinUser?._id || false
      }

      function getCurrentNotificationChat (): IMessage | undefined {
            return notification?.find((item) => item.chat._id === chat._id)
      }

      function onSelectChat (): void {
            setSelectedChat(chat)
            if (isNotification()) {
                  removeNotification(getCurrentNotificationChat())
            }
      }
      return (
            <li onClick={() => onSelectChat()}
                  className={`flex items-center rounded-lg justify-between px-3 py-3 my-1 hover:bg-gray-100 dark:hover:bg-dark-secondary-bg cursor-pointer transition-colors duration-200
                   ${selectedChat?._id === chat._id && 'bg-gray-100 dark:bg-dark-secondary-bg'}`}>
                  <div className="flex items-center w-full">
                        <Avatar src={chat.isGroupChat ? chat.groupImage : getSender(chat.users)?.profileImg} alt='profile-image' />
                        <div className="ml-3 w-full">
                              <div className='flex justify-between items-center'>
                                    <h3 className="text-lg  font-bold">{chat.isGroupChat ? chat.chatName : getSender(chat.users)?.username}</h3>
                                    <span className='text-gray-400 dark:text-dark-primary-text text-sm'>
                                          {formatTime(chat.latestMessage ? chat?.latestMessage?.createdAt : chat.createdAt)}
                                    </span>
                              </div>
                              <div className='flex justify-between'>
                                    <div
                                          className={`text-base h-6 max-h-[24px] max-w-[260px] inline-block ellipsis-text
                                           ${isNotification() ? 'text-blue-500' : 'text-[#00000085] dark:text-dark-primary-text'}`}
                                    >
                                          {getLatestMessage()}
                                    </div>
                                    {isNotification() && <span className='bg-blue-400 text-white text-sm flex items-center h-[90%] w-5 justify-center rounded-full'>{getCurrentNotificationChat()?.count}</span>}
                              </div>
                        </div>
                  </div>
            </li>
      )
}

import React, { useEffect, useState } from 'react'

import useStore from "../../../context/store/useStore"
import { AuthState } from "../../../context/useAuth"

import { IUser } from "../../../model/user.model"
import socketService, { SOCKET_LOGIN, SOCKET_LOGOUT } from '../../../services/socket.service'
import ProfileImage from '../../common/ProfileImage'
import { userService } from '../../../services/user.service'
import { formatLastSeenDate } from '../../../utils/functions'

interface Props {
      conversationUser: IUser | null
      chatMode: "chat" | "info" | "send-file"
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
      conversationUserRef: React.MutableRefObject<IUser | null>
}

type connection = {
      isOnline: boolean
      lastSeen: string
}

export default function ChatHeader({ conversationUser, conversationUserRef, chatMode, setChatMode }: Props): JSX.Element {
      const { selectedChat, setSelectedChat } = useStore()
      const { user: loggedInUser } = AuthState()
      const [isTyping, setIsTyping] = useState<boolean>(false);
      const [connectionStatus, setConnectionStatus] = useState<string>('')
      const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false)

      useEffect(() => {
            socketService.on('typing', () => setIsTyping(true));
            socketService.on('stop typing', () => setIsTyping(false));

            fetchConnectionStatus()
            return () => {
                  socketService.on('stop typing', () => setIsTyping(false));
                  setIsTyping(false)
            }
      }, [selectedChat, conversationUser]);

      async function fetchConnectionStatus() {
            if (selectedChat?.isGroupChat || !conversationUser?._id) return
            try {
                  setIsLoadingStatus(true)
                  const connection = await userService.getUserConnectionStatus(conversationUser._id as string) as connection
                  const status = connection.isOnline ? 'Online' : `Last seen ${formatLastSeenDate(conversationUser?.lastSeen as string)}`
                  setConnectionStatus(status)
            } catch (err) {
                  console.error('Failed to fetch user connection status:', err)

            } finally {
                  setIsLoadingStatus(false)
            }
      }

      useEffect(() => {
            socketService.on(SOCKET_LOGIN, handleConnection, true)
            socketService.on(SOCKET_LOGOUT, handleConnection, false)

            return () => {
                  socketService.off(SOCKET_LOGIN, handleConnection)
                  socketService.off(SOCKET_LOGOUT, handleConnection)
            }
      }, [selectedChat])

      function handleConnection(userId: string, status: boolean): void {
            if (userId !== conversationUserRef?.current?._id) return
            const date = new Date()
            setConnectionStatus(
                  status ? 'Online' : `Last seen ${formatLastSeenDate(date.toString())}`
            )
      }

      function toggleChatInfo(): void {
            if (chatMode === 'info') setChatMode('chat')
            else setChatMode('info')
      }

      if (!selectedChat) return <div></div>
      return (
            <header className='flex items-center px-2 chat-header-shadow bg-white dark:bg-dark-secondary-bg'>
                  <span
                        className="material-symbols-outlined md:hidden text-3xl leading-none text-primary dark:text-dark-primary-text ml-2 mr-4 cursor-pointer"
                        onClick={() => setSelectedChat(null)}
                        >chevron_left
                  </span>
                  <ProfileImage
                        className="default-profile-img w-10 h-10 max-w-none hover:scale-105"
                        src={selectedChat.isGroupChat ? selectedChat.groupImage : conversationUser?.profileImg}
                        alt={conversationUser?.username}
                        onClick={toggleChatInfo}
                  />
                  <div className='flex items-center gap-4 ml-4 justify-between w-full'>
                        <div className='flex flex-col'>
                              <h2 className='cursor-pointer font-semibold tracking-wider dark:text-dark-primary-text underline-offset-2 hover:underline' onClick={toggleChatInfo}>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
                              {!selectedChat.isGroupChat ? (
                                    <span className='text-primary dark:text-dark-primary-text text-sm'>
                                          {isTyping ? 'Typing...' : isLoadingStatus ? '' : connectionStatus}
                                    </span>
                              ) : (
                                    <div className="text-xs tracking-wide max-w-[160px] md:max-w-[300px] overflow-hidden ellipsis-text">
                                          {selectedChat.users.map((user, index) =>
                                                <span key={user._id} className="text-slate-400 dark:text-slate-200 mr-1">
                                                      {user._id === loggedInUser?._id ? 'You' : user.username}
                                                      {index !== selectedChat.users.length - 1 && ","}
                                                </span>
                                          )}
                                    </div>
                              )}
                        </div>
                        <div className='flex items-center gap-x-2'>
                              <div className='flex items-center justify-center text-gray-500 dark:text-dark-primary-text hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg leading-none p-2 rounded-xl cursor-pointer' onClick={() => setChatMode('info')}>
                                    <span className="material-symbols-outlined">info</span>
                              </div>
                        </div>
                  </div>
            </header>
      )
}

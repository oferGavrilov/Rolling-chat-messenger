import React, { useCallback, useEffect, useState } from 'react'
import useStore from "../../../context/store/useStore"
import { AuthState } from "../../../context/useAuth"
import { IUser } from "../../../model/user.model"
import socketService from '../../../services/socket.service'
import { SocketOnEvents } from "../../../utils/socketEvents"
import ProfileImage from '../../common/ProfileImage'
import { userService } from '../../../services/user.service'
import { formatLastSeenDate } from '../../../utils/functions'

interface Props {
      conversationUser: IUser | null
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "edit-file">>
      conversationUserRef: React.MutableRefObject<IUser | null>
}

type connection = {
      isOnline: boolean
      lastSeen: string
}

export default function ChatHeader({ conversationUser, conversationUserRef, setChatMode }: Props): JSX.Element {
      const { selectedChat, setSelectedChat } = useStore()
      const { user: loggedInUser } = AuthState()
      const [isTyping, setIsTyping] = useState<boolean>(false)
      const [connectionStatus, setConnectionStatus] = useState<string>('')
      const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false)

      const handleConnection = useCallback(({ userId, status }: { userId: string, status: boolean }): void => {
            if (userId !== conversationUserRef?.current?._id) return
            const date = new Date()
            setConnectionStatus(status ? 'Online' : `Last seen ${formatLastSeenDate(date.toString())}`)
      }, [conversationUserRef])

      useEffect(() => {
            const typingEvent = () => setIsTyping(true)
            const stopTypingEvent = () => setIsTyping(false)

            socketService.on(SocketOnEvents.USER_TYPING, typingEvent)
            socketService.on(SocketOnEvents.STOP_TYPING, stopTypingEvent)

            return () => {
                  socketService.off(SocketOnEvents.USER_TYPING, typingEvent)
                  socketService.off(SocketOnEvents.STOP_TYPING, stopTypingEvent)
            }
      }, [selectedChat?._id, conversationUser])

      useEffect(() => {
            socketService.on(SocketOnEvents.LOGIN, handleConnection)
            socketService.on(SocketOnEvents.LOGOUT, handleConnection)

            return () => {
                  socketService.off(SocketOnEvents.LOGIN, handleConnection)
                  socketService.off(SocketOnEvents.LOGOUT, handleConnection)
            }
      }, [conversationUserRef?.current?._id, conversationUserRef, handleConnection])

      useEffect(() => {
            if (selectedChat?.isGroupChat || !conversationUser?._id || selectedChat?.isNewChat) return

            if (conversationUser._id === 'default') return // to prevent fetching connection status for removed user

            const fetchConnectionStatus = async (): Promise<void> => {
                  try {
                        setIsLoadingStatus(true)
                        const connection = await userService.getUserConnectionStatus(conversationUser._id) as connection
                        const status = connection.isOnline ? 'Online' : `Last seen ${formatLastSeenDate(connection.lastSeen as string)}`
                        setConnectionStatus(status)
                  } catch (err) {
                        console.error('Failed to fetch user connection status:', err)
                  } finally {
                        setTimeout(() => setIsLoadingStatus(false), 1000) // for smooth transition
                  }
            }

            fetchConnectionStatus()
      }, [selectedChat?._id, conversationUser])

      const toggleChatInfo = (): void => setChatMode(prevMode => prevMode === 'info' ? 'chat' : 'info')

      if (!selectedChat || !conversationUser) return <div></div>
      return (
            <header className='flex items-center px-2 chat-header-shadow bg-white dark:bg-dark-secondary-bg'>
                  <button
                        className="material-symbols-outlined md:hidden text-3xl leading-none text-primary dark:text-dark-primary-text ml-2 mr-4 cursor-pointer"
                        onClick={() => setSelectedChat(null)}
                        aria-label='Close chat'>
                        chevron_left
                  </button>
                  <ProfileImage
                        className="default-profile-img w-10 h-10 max-w-none hover:scale-105"
                        src={selectedChat.isGroupChat ? selectedChat.groupImage as string : conversationUser.profileImg as string}
                        alt={`${conversationUser.username}'s profile image`}
                        onClick={toggleChatInfo}
                  />
                  <div className='flex items-center gap-4 ml-4 justify-between w-full'>
                        <div className='flex flex-col'>
                              <h2 className='cursor-pointer font-bold tracking-wider dark:text-dark-primary-text 2xl:text-lg underline-offset-2 hover:underline' onClick={toggleChatInfo}>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
                              {!selectedChat.isGroupChat ? (
                                    <span className={`text-primary dark:text-dark-primary-text text-sm transition-all duration-200 ${isLoadingStatus ? 'max-h-0 opacity-0' : 'max-h-5 opacity-100'} 3xl:text-lg 2xl:leading-none`}>
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
                              <button
                                    className='flex items-center justify-center text-gray-500 dark:text-dark-primary-text hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg leading-none p-2 rounded-xl material-symbols-outlined'
                                    onClick={() => setChatMode('info')}
                                    aria-label='Chat info'
                                    title='Chat info'
                              >
                                    info
                              </button>
                        </div>
                  </div>
            </header>
      )
}

import React from 'react'

import { Avatar } from "@mui/material"

import { BsCameraVideo } from 'react-icons/bs'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { IoIosArrowBack } from 'react-icons/io'

import useChat from "../../../store/useChat"
import { AuthState } from "../../../context/useAuth"

import { IUser } from "../../../model/user.model"

interface Props {
      isTyping: boolean
      connectionStatus: string
      conversationUser: IUser | null
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
}

export default function ChatHeader ({ isTyping, connectionStatus, conversationUser, setChatMode }: Props): JSX.Element {
      const { selectedChat, setSelectedChat } = useChat()
      const { user: loggedInUser } = AuthState()

      if (!selectedChat) return <div></div>
      return (
            <div className='flex items-center px-2 min-h-[64px] z-10 chat-header-shadow md:h-[4.4rem] bg-white dark:bg-dark-secondary-bg'>
                  <IoIosArrowBack size={30} className='md:hidden text-primary dark:text-dark-primary-text ml-2 mr-4 cursor-pointer' onClick={() => setSelectedChat(null)} />
                  <Avatar className="hover:scale-110 transition-all duration-300 cursor-pointer" src={selectedChat.isGroupChat ? selectedChat.groupImage : conversationUser?.profileImg} alt={conversationUser?.username} onClick={() => setChatMode('info')} />
                  <div className='flex items-center gap-4 ml-4 justify-between w-full'>
                        <div className='flex flex-col'>
                              <h2 className='md:text-lg font-semibold cursor-pointer dark:text-dark-primary-text underline-offset-2 hover:underline' onClick={() => setChatMode('info')}>{selectedChat.isGroupChat ? selectedChat.chatName : conversationUser?.username}</h2>
                              {!selectedChat.isGroupChat ?
                                    <span className='text-primary dark:text-dark-primary-text text-xs md:text-base'>
                                          {isTyping ? 'Typing...' : connectionStatus}
                                    </span> : (
                                          <div className="flex gap-x-1 text-xs tracking-wide">
                                                {selectedChat.users.map((user, index) =>
                                                      <span key={user._id} className="text-slate-400 dark:text-slate-200">
                                                            {user._id === loggedInUser?._id ? 'You' : user.username}
                                                            {index !== selectedChat.users.length - 1 && ","}
                                                      </span>
                                                )}
                                          </div>
                                    )}
                        </div>
                        <div className='flex items-center gap-x-2'>
                              <div className='text-primary dark:text-dark-primary-text text-2xl hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg py-2 px-2 rounded-lg cursor-pointer'>
                                    <BsCameraVideo />
                              </div>
                              <div className='text-gray-500 dark:text-dark-primary-text hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg text-2xl py-2 px-1 rounded-lg cursor-pointer' onClick={() => setChatMode('info')}>
                                    <AiOutlineInfoCircle />
                              </div>
                        </div>
                  </div>
            </div>
      )
}

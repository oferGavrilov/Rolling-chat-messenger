import { useEffect, useRef, useState } from 'react'

import useChat from '../../../store/useChat'
import { AuthState } from '../../../context/useAuth'

import Messages from './messages/Messages'
import socketService from '../../../services/socket.service'

import { IMessage } from '../../../model/message.model'

import { scrollToBottom } from '../../../utils/functions'

interface Props {
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
      messages: IMessage[]
      fetchMessages: () => Promise<void>
      onRemoveMessage: (message: IMessage, removerId: string) => void
}

export default function Chat ({
      setChatMode,
      messages,
      fetchMessages,
      onRemoveMessage
}: Props): JSX.Element {
      const [loadingMessages, setLoadingMessages] = useState<boolean>(false)

      const { selectedChat, replyMessage, setReplyMessage } = useChat()
      const { user: loggedInUser, chatBackgroundColor } = AuthState()

      const chatRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
            if (!selectedChat) return

            socketService.emit('join chat', { chatId: selectedChat._id, userId: loggedInUser?._id })

            setReplyMessage(null)

            const fetchData = async () => {
                  setLoadingMessages(true)
                  await fetchMessages()
                  setLoadingMessages(false)
                  scrollToBottom(chatRef)
            }

            fetchData()

            return () => {
                  socketService.emit('leave chat', { chatId: selectedChat._id, userId: loggedInUser?._id })
            }
      }, [selectedChat])

      useEffect(() => {
            scrollToBottom(chatRef)
      }, [messages, replyMessage])

      return (
            <>
                  <div className='chat-bg-color' style={{ backgroundColor: chatBackgroundColor }}></div>
                  <div className="chat-bg-img" />

                  <div
                        className={`overflow-y-auto overflow-x-hidden slide-left h-full bg-no-repeat bg-cover bg-center scroll-smooth 
                                    ${loadingMessages && 'blur-[2px]'}`}
                        ref={chatRef}
                  >
                        {messages &&
                              <Messages
                                    messages={messages}
                                    setChatMode={setChatMode}
                                    onRemoveMessage={onRemoveMessage}
                              />
                        }
                  </div>
            </>
      )
}

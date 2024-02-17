import { useCallback, useEffect, useRef, useState } from 'react'
import useStore from '../../../context/store/useStore'
import { AuthState } from '../../../context/useAuth'
import Messages from './messages/Messages'
import socketService from '../../../services/socket.service'
import { scrollToBottom } from '../../../utils/functions'
import { messageService } from '../../../services/message.service'

interface Props {
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
}

export default function Chat({ setChatMode }: Props): JSX.Element {
      const [loadingMessages, setLoadingMessages] = useState<boolean>(false)
      const { selectedChat, replyMessage, setReplyMessage, messages, setMessages, updateChatReadReceipts } = useStore()
      const { user: loggedInUser, chatBackgroundColor } = AuthState()
      const chatRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
            if (!selectedChat || !loggedInUser) return

            const joinChat = async () => {
                  if (selectedChat._id === 'temp-id') return
                  socketService.emit('join chat', { chatId: selectedChat._id, userId: loggedInUser._id })
                  setReplyMessage(null)
                  // await fetchMessages()
            }

            joinChat()

            return () => {
                  socketService.emit('leave chat', { chatId: selectedChat._id, userId: loggedInUser._id })
            }

      }, [selectedChat, loggedInUser, setReplyMessage])

      useEffect(() => {
            scrollToBottom(chatRef)
      }, [messages, replyMessage])

      const fetchMessages = useCallback(async () => {
            if (!selectedChat || selectedChat._id === 'temp-id' || !loggedInUser || selectedChat?.isNewChat) {
                  // setMessages([])
                  return
            }

            try {
                  setLoadingMessages(true)
                  const fetchedMessages = await messageService.getMessages(selectedChat._id)

                  updateChatReadReceipts(selectedChat._id, loggedInUser._id);

                  setMessages(fetchedMessages)
                  scrollToBottom(chatRef)
            } catch (error) {
                  console.error('Failed to fetch messages:', error)
            } finally {
                  setLoadingMessages(false)
            }
      }, [selectedChat, loggedInUser, setMessages, updateChatReadReceipts]);

      useEffect(() => {
            fetchMessages();
      }, [fetchMessages]);


      return (
            <>
                  <div className='chat-bg-color' style={{ backgroundColor: chatBackgroundColor.color }}></div>
                  <div className="chat-bg-img" style={{ opacity: chatBackgroundColor.opacity }} />

                  <div
                        className={`overflow-y-auto overflow-x-hidden slide-left h-full bg-no-repeat bg-cover bg-center scroll-smooth ${loadingMessages ? 'blur-[2px]' : ''}`}
                        ref={chatRef}
                  >
                        {messages &&
                              <Messages
                                    messages={messages}
                                    setChatMode={setChatMode}
                              />
                        }
                  </div>
            </>
      )
}

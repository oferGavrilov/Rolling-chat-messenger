import useChat from '../../../store/useChat'
import { useEffect, useRef, useState } from 'react'
import { chatService } from '../../../services/chat.service'
import { IMessage } from '../../../model/message.model'
import ChatMessages from './ChatMessages'

import { AuthState } from '../../../context/useAuth'
import socketService from '../../../services/socket.service'
import AddFileModal from './AddFileModal'

interface Props {
      setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
      setChatMode: React.Dispatch<React.SetStateAction<string>>
      setFile: React.Dispatch<React.SetStateAction<File | null>>
      messages: IMessage[]
      setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
}
type Timer = NodeJS.Timeout | number

export default function Chat ({ setIsTyping, setChatMode, setFile, messages, setMessages }: Props) {

      const [newMessage, setNewMessage] = useState<string>('')
      const [typing, setTyping] = useState<boolean>(false)

      const { selectedChat, chats, setChats, updateChat, addNotification } = useChat()
      const { user, chatBackgroundColor } = AuthState()

      const chatRef = useRef<HTMLDivElement>(null)
      const typingTimeoutRef = useRef<Timer | null>(null)


      useEffect(() => {
            const handleTyping = () => setIsTyping(true)
            const handleStopTyping = () => setIsTyping(false)

            socketService.on('typing', handleTyping)
            socketService.on('stop typing', handleStopTyping)

            return () => {
                  socketService.off('typing', handleTyping)
                  socketService.off('stop typing', handleStopTyping)
            }
      })

      useEffect(() => {
            socketService.on('message received', (newMessage: IMessage) => {
                  console.log('new message', newMessage)
                  if (selectedChat?._id !== newMessage.chat._id) {
                        addNotification(newMessage)
                        return
                  }

                  setMessages((prevMessages) => [...prevMessages, newMessage])

                  updateChat(newMessage)

                  scrollToBottom()
            })

            return () => {
                  socketService.off('message received')
            }
      })

      async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault()
            if (!newMessage || !selectedChat) return

            // Optimistic Update: Add the new message to the state immediately
            const optimisticMessage: IMessage = {
                  _id: 'temp-id',
                  sender: user!,
                  content: newMessage,
                  chat: selectedChat,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
            }

            setNewMessage('')
            setMessages([...messages, optimisticMessage])
            setChatOnTop(optimisticMessage)
            scrollToBottom()

            try {
                  socketService.emit('stop typing', selectedChat?._id)
                  const messageToUpdate = await chatService.sendMessage({ content: newMessage, chatId: selectedChat?._id , messageType:'text'})

                  setMessages((prevMessages) =>
                        prevMessages.map((message) => (message._id === 'temp-id' ? messageToUpdate : message))
                  )
                  socketService.emit('new message', messageToUpdate)

            } catch (error) {
                  console.error('Failed to send message:', error)
                  setMessages([...messages])
            }
      }
      // TODO: call the function when send a message
      function setChatOnTop (message: IMessage): void {
            const chatToUpdateIndex = chats.findIndex(chat => chat._id === selectedChat?._id)
            if (chatToUpdateIndex !== -1) {
                  const chatToUpdate = chats[chatToUpdateIndex]
                  chatToUpdate.latestMessage = message
                  const updatedChats = [chatToUpdate, ...chats.slice(0, chatToUpdateIndex), ...chats.slice(chatToUpdateIndex + 1)]
                  setChats(updatedChats)
            }
      }

      function typingHandler (e: React.ChangeEvent<HTMLInputElement>) {
            const { value } = e.target
            setNewMessage(value)

            if (!typing) {
                  setTyping(true)
                  socketService.emit('typing', { chatId: selectedChat?._id, userId: user?._id })
            }

            if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current)
            }

            const timerLength = 2000
            typingTimeoutRef.current = setTimeout(() => {
                  socketService.emit('stop typing', selectedChat?._id)
                  setTyping(false)
            }, timerLength)
      }

      function scrollToBottom () {
            setTimeout(() => {
                  const chatContainer = chatRef.current
                  if (chatContainer) {
                        chatContainer.scrollTop = chatContainer.scrollHeight
                  }
            }, 0)
      }

      const isMessageEmpty = !newMessage || newMessage.trim() === ''

      return (
            <>
                  <div
                        className='border-y border-1 overflow-auto slide-left bg-no-repeat bg-cover bg-center'
                        style={{ background: chatBackgroundColor }}
                  >
                        <div
                              className='absolute right-0 top-0 overflow-auto w-full h-full scroll-smooth'
                              style={{ backgroundImage: 'url(imgs/chat/background.png)' }}
                              ref={chatRef}

                        >
                              {messages &&
                                    <ChatMessages messages={messages} setChatMode={setChatMode} />
                              }
                        </div>
                  </div>

                  <div className='py-3 flex items-center md:px-5 gap-x-5 overflow-x-hidden'>
                       <AddFileModal setFile={setFile} setChatMode={setChatMode}/>

                        <form onSubmit={handleSubmit} className='w-full flex'>
                              <input
                                    type="text"
                                    className='bg-gray-100 w-full px-4 rounded-xl py-2 focus-visible:outline-none'
                                    placeholder='Type a message...'
                                    value={newMessage}
                                    onChange={typingHandler}
                              />
                              <button disabled={isMessageEmpty} type='submit'
                                    className={`text-primary ml-2 transition-all duration-200 ease-in whitespace-nowrap hover:bg-primary hover:text-white p-2 rounded-lg
                                    ${isMessageEmpty ? 'disabled:!text-gray-400 disabled:cursor-not-allowed w-0 translate-x-28' : 'mr-2'}`
                                    }>
                                    Send
                              </button>
                        </form>
                  </div>
            </>

      )
}

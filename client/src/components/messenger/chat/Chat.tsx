
import { AiOutlinePaperClip } from 'react-icons/ai'
import useChat from '../../../store/useChat'
import { useEffect, useRef, useState } from 'react'
import { chatService } from '../../../services/chat.service'
import { IMessage } from '../../../model/message.model'
import ChatMessages from './ChatMessages'
import { Socket, io } from 'socket.io-client'
import { AuthState } from '../../../context/useAuth'
import { IChat } from '../../../model/chat.model'
import { clearTypingTimeout, startTypingTimeout } from '../../../utils/functions'

const ENDPOINT = 'http://localhost:5000'

interface Props {
      isTyping: boolean
      setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
}

let socket: Socket, selectedChatCompare: IChat | null = null

export default function Chat ({ isTyping, setIsTyping }: Props) {

      const [messages, setMessages] = useState<IMessage[]>([])
      const [newMessage, setNewMessage] = useState<string>('')
      const [socketConnected, setSocketConnected] = useState<boolean>(false)

      const { selectedChat } = useChat()
      const { user } = AuthState()
      const chatRef = useRef<HTMLDivElement>(null)
      const typingTimeoutRef = useRef<number | undefined>()

      useEffect(() => {
            socket = io(ENDPOINT, { transports: ['websocket'] })
            socket.emit('setup', user._id)
            socket.on('connected', () => setSocketConnected(true))
            socket.on('typing', () => setIsTyping(true))
            socket.on('stop typing', () => setIsTyping(false))
      }, [setIsTyping, user._id])

      useEffect(() => {
            async function fetchMessages () {
                  if (!selectedChat) return
                  const data = await chatService.getMessages(selectedChat._id)
                  setMessages(data)
                  socket.emit('join chat', selectedChat._id)

                  scrollToBottom()
            }

            fetchMessages()
            selectedChatCompare = selectedChat
      }, [selectedChat])

      useEffect(() => {
            socket.on('message received', (newMessage: IMessage) => {
                  if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) return
                  setMessages((prevMessages) => [...prevMessages, newMessage])

                  scrollToBottom()
            })

            return () => {
                  socket.off('message received')
            }
      }, [])


      async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault()
            if (!newMessage) return
            socket.emit('stop typing', selectedChat._id)
            setNewMessage('')
            const messageToUpdate = await chatService.sendMessage({ content: newMessage, chatId: selectedChat._id })
            socket.emit('new message', messageToUpdate)
            setMessages([...messages, messageToUpdate])

            scrollToBottom()
      }

      function typingHandler (e: React.ChangeEvent<HTMLInputElement>) {
            const { value } = e.target
            setNewMessage(value)

            if (!socketConnected) return

            if (!isTyping) {
                  setIsTyping(true)
                  socket.emit('typing', selectedChat._id)
            }

            if (typingTimeoutRef.current) {
                  clearTypingTimeout(typingTimeoutRef.current)
            }

            typingTimeoutRef.current = startTypingTimeout(() => {
                  if (isTyping) {
                        socket.emit('stop typing', selectedChat._id)
                        setIsTyping(false)
                  }
            }, 2000)
      }

      function scrollToBottom () {
            setTimeout(() => {
                  chatRef.current?.scrollTo({
                        top: chatRef.current.scrollHeight,
                        behavior: 'smooth',
                  })
            }, 0)
      }


      return (
            <>
                  <div className='bg-gray-100 border-y py-4 border-1 overflow-auto slide-left' ref={chatRef}>
                        {messages && <ChatMessages messages={messages} />}
                  </div>

                  <div className='py-3 flex items-center ml-5  md:px-5 gap-x-5 overflow-x-hidden'>
                        <div className='text-gray-500 text-2xl hover:text-gray-600 cursor-pointer'>
                              <AiOutlinePaperClip />
                        </div>
                        <form onSubmit={handleSubmit} className='w-full flex'>
                              <input
                                    type="text"
                                    className='bg-gray-100 w-full px-4 rounded-xl py-2 focus-visible:outline-none'
                                    placeholder='Type a message...'
                                    value={newMessage}
                                    onChange={typingHandler}
                              />
                              <button disabled={!newMessage} type='submit'
                                    className={`text-primary ml-2 transition-all duration-200 ease-in whitespace-nowrap hover:bg-primary hover:text-white p-2 rounded-lg
                                    ${newMessage ? 'mr-2' : 'disabled:!text-gray-400 disabled:cursor-not-allowed w-0 translate-x-28'}`
                                    }>
                                    Send
                              </button>
                        </form>
                  </div>
            </>

      )
}

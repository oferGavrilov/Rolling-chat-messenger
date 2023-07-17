
import { AiOutlinePaperClip } from 'react-icons/ai'
import useChat from '../../../store/useChat'
import { useEffect, useRef, useState } from 'react'
import { chatService } from '../../../services/chat.service'
import { IMessage } from '../../../model/message.model'
import ChatMessages from './ChatMessages'
import { Socket, io } from 'socket.io-client'
import { AuthState } from '../../../context/useAuth'
import { IChat } from '../../../model/chat.model'

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://rolling-2szg.onrender.com' : 'http://localhost:5000';

interface Props {
      isTyping: boolean
      setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
}
type Timer = NodeJS.Timeout | number;

let socket: Socket

export default function Chat ({ setIsTyping }: Props) {

      const [messages, setMessages] = useState<IMessage[]>([])
      const [newMessage, setNewMessage] = useState<string>('')
      const [socketConnected, setSocketConnected] = useState<boolean>(false)
      const [typing, setTyping] = useState<boolean>(false)

      const { selectedChat, chats, setChats, selectedChatCompare, setSelectedChatCompare } = useChat()
      const { user, chatBackground } = AuthState()
      
      const chatRef = useRef<HTMLDivElement>(null)

      const typingTimeoutRef = useRef<Timer | null>(null);

      useEffect(() => {
            socket = io(ENDPOINT, { transports: ['websocket'] })
            socket.emit('setup', user?._id)

            socket.on('connected', () => setSocketConnected(true))

      }, [])

      useEffect(() => {
            socket.on('typing', () => setIsTyping(true))
            socket.on('stop typing', () => setIsTyping(false))
      }, [setIsTyping])

      useEffect(() => {
            async function fetchMessages () {
                  if (!selectedChat) return
                  const data = await chatService.getMessages(selectedChat._id)
                  setMessages(data)
                  socket.emit('join chat', selectedChat._id)

                  scrollToBottom()
            }

            fetchMessages()
            setSelectedChatCompare(selectedChat)
      }, [selectedChat])

      useEffect(() => {
            socket.on('message received', (newMessage: IMessage) => {
                  if (selectedChatCompare?._id !== newMessage.chat._id) return
                  setMessages((prevMessages) => [...prevMessages, newMessage])
                  updateChat(newMessage, chats)

                  scrollToBottom()
            })
            return () => {
                  socket.off('message received')
            }
      })

      function updateChat (latestMessage: IMessage, chats: IChat[]) {
            const chatIndex = chats.findIndex((chat) => chat._id === latestMessage.chat._id)
            if (chatIndex !== -1) {
                  const updatedChats = [...chats]
                  updatedChats[chatIndex] = { ...updatedChats[chatIndex], latestMessage }
                  const chat = updatedChats.splice(chatIndex, 1)[0]
                  updatedChats.unshift(chat)
                  setChats(updatedChats)
            }
      }

      async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault()
            if (!newMessage || !selectedChat) return
            socket.emit('stop typing', selectedChat?._id)
            setNewMessage('')
            const messageToUpdate = await chatService.sendMessage({ content: newMessage, chatId: selectedChat?._id })
            socket.emit('new message', messageToUpdate)
            setMessages([...messages, messageToUpdate])

            setChatOnTop(messageToUpdate)

            scrollToBottom()
      }

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
            if (!socketConnected) return

            if (!typing) {
                  setTyping(true)
                  socket.emit('typing', selectedChat?._id, user?._id)
            }

            if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current)
            }

            const timerLength = 2000
            typingTimeoutRef.current = setTimeout(() => {
                  socket.emit('stop typing', selectedChat?._id)
                  setTyping(false)
            }, timerLength) 
      }

      function scrollToBottom () {
            setTimeout(() => {
                  chatRef.current?.scrollTo({
                        top: chatRef.current.scrollHeight,
                        behavior: 'smooth',
                  })
            }, 0)
      }

      const isMessageEmpty = !newMessage || newMessage.trim() === '';
      
      return (
            <>
                  <div className='border-y py-4 border-1 overflow-auto slide-left bg-no-repeat bg-cover bg-center' style={{ background: chatBackground }} ref={chatRef}>
                        <div className='absolute right-0 top-0 w-full h-full ' style={{ backgroundImage: 'url(imgs/chat/background.png)' }}>
                              {messages && <ChatMessages messages={messages} />}
                        </div>
                  </div>

                  <div className='py-3 flex items-center ml-1  md:px-5 gap-x-5 overflow-x-hidden'>
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


import useChat from '../../../store/useChat'
import { useEffect, useRef, useState } from 'react'
import { chatService } from '../../../services/chat.service'
import { IMessage } from '../../../model/message.model'
import ChatMessages from './ChatMessages'

import { Socket, io } from 'socket.io-client'
import { AuthState } from '../../../context/useAuth'
import { IChat } from '../../../model/chat.model'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useClickOutside } from '../../../custom/useClickOutside'
import { toast } from 'react-toastify'
import { uploadImg } from '../../../utils/upload-img'

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://rolling-948m.onrender.com/' : 'http://localhost:5000'

interface Props {
      isTyping: boolean
      setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
      setChatMode: React.Dispatch<React.SetStateAction<string>>
      setFile: React.Dispatch<React.SetStateAction<File | null>>
}
type Timer = NodeJS.Timeout | number

let socket: Socket

export default function Chat ({ setIsTyping, setChatMode, setFile }: Props) {

      const [messages, setMessages] = useState<IMessage[]>([])
      const [newMessage, setNewMessage] = useState<string>('')
      const [socketConnected, setSocketConnected] = useState<boolean>(false)
      const [typing, setTyping] = useState<boolean>(false)
      const [showClipModal, setShowClipModal] = useState<boolean>(false)

      const { selectedChat, chats, setChats, selectedChatCompare, setSelectedChatCompare } = useChat()
      const { user, chatBackgroundColor } = AuthState()

      const chatRef = useRef<HTMLDivElement>(null)
      const modalRef = useRef<HTMLUListElement>(null)
      const typingTimeoutRef = useRef<Timer | null>(null)

      useClickOutside(modalRef, () => setShowClipModal(false), showClipModal)

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
                  socket.emit('stop typing', selectedChat?._id)
                  const messageToUpdate = await chatService.sendMessage({ content: newMessage, chatId: selectedChat?._id })

                  setMessages((prevMessages) =>
                        prevMessages.map((message) => (message._id === 'temp-id' ? messageToUpdate : message))
                  )
                  socket.emit('new message', messageToUpdate)

            } catch (error) {
                  console.error('Failed to send message:', error)
                  setMessages([...messages])
            }
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
                  const chatContainer = chatRef.current
                  if (chatContainer) {
                        chatContainer.scrollTop = chatContainer.scrollHeight
                  }
            }, 0)
      }

      async function uploadImage (file: File | undefined) {
            if (!file) return toast.error('Upload image went wrong')
            try {
                  const data = await uploadImg(file)
                  setFile(data?.url)
                  setChatMode('send-file')
            } catch (err) {
                  console.log(err)
            }
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
                        <div className='relative'>
                              <AddRoundedIcon
                                    onClick={() => setShowClipModal((prev) => !prev)}
                                    className={`text-slate-500 !text-[2rem] !transition-transform !duration-300 hover:text-gray-600 cursor-pointer
                                    ${showClipModal ? '-rotate-[135deg] bg-gray-200 rounded-full pointer-events-none' : ''} `} />

                              <ul
                                    ref={modalRef}
                                    className={`
                                    fixed bottom-14 left-8 px-2 py-3 text-white rounded-lg z-20 bg-gray-400 overflow-hidden
                                     transition-all duration-300 ease-in-out
                                    ${showClipModal ? 'w-auto max-h-[300px] max-w-xs' : 'max-h-0 px-0 !py-0 max-w-[80px]'}`}>

                                    <label className='clip-modal-option img-upload'>
                                          <input type="file" name='image' id='img-upload' className='opacity-0 h-0 w-0' accept='image/gif, image/jpeg, image/png' onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                uploadImage(e.target.files?.[0])
                                          } />
                                          Images and Videos</label>
                                    <li className='clip-modal-option my-1'>Camera</li>
                                    <li className='clip-modal-option'>File</li>
                              </ul>
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

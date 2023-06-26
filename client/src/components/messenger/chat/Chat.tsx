
import { AiOutlinePaperClip } from 'react-icons/ai'
import useChat from '../../../store/useChat'
import { useEffect, useState } from 'react'
import { chatService } from '../../../services/chat.service'
import { IMessage } from '../../../model/message.model'
import ChatMessages from './ChatMessages'
import { io } from 'socket.io-client'
import { AuthState } from '../../../context/useAuth'

const ENDPOINT = 'http://localhost:5000'
let socket, selectedChatCompare

export default function Chat () {
      const [messages, setMessages] = useState<IMessage[]>([])
      const [newMessage, setNewMessage] = useState<string>('')
      const { selectedChat } = useChat()
      const { user } = AuthState()

      useEffect(() => {
            fetchMessages()
      }, [selectedChat])

      useEffect(() => {
            socket = io(ENDPOINT, { transports: ['websocket'] })
            socket.emit('setup', user._id)
            socket.on('connection', () => console.log('connected'))
      }, [])

      async function fetchMessages () {
            if (!selectedChat) return
            const data = await chatService.getMessages(selectedChat._id)
            setMessages(data)
            socket.emit('join', selectedChat._id)
      }

      async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault()
            if (!newMessage) return
            setNewMessage('')
            const messageToUpdate = await chatService.sendMessage({ content: newMessage, chatId: selectedChat._id })
            console.log(messageToUpdate)
            setMessages([...messages, messageToUpdate])
      }


      return (
            <>
                  <div className='bg-gray-100 border-y border-1 overflow-auto slide-left'>
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
                                    onChange={(e) => setNewMessage(e.target.value)}
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

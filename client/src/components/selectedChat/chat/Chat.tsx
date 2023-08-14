import useChat from '../../../store/useChat'
import { useEffect, useRef, useState } from 'react'
import { chatService } from '../../../services/chat.service'
import { IMessage } from '../../../model/message.model'
import ChatMessages from './ChatMessages'

import { AuthState } from '../../../context/useAuth'
import socketService from '../../../services/socket.service'
import AddFileModal from './AddFileModal'
import { scrollToBottom } from '../../../utils/functions'

import { uploadAudio } from '../../../utils/cloudinary'
import AudioRecorder from './AudioRecorder'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

interface Props {
      setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
      setChatMode: React.Dispatch<React.SetStateAction<string>>
      setFile: React.Dispatch<React.SetStateAction<File | null>>
      messages: IMessage[]
      setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
      fetchMessages: () => Promise<void>
      onSendMessage: (message: string | File, messageType: "text" | "image" | "audio" | "file", recordTimer?: number) => Promise<void>
      setChatOnTop: (message: IMessage) => void
}
type Timer = NodeJS.Timeout | number

export default function Chat ({
      setIsTyping,
      setChatMode,
      setFile,
      messages,
      setMessages,
      fetchMessages,
      onSendMessage,
      setChatOnTop }: Props): JSX.Element {

      const [newMessage, setNewMessage] = useState<string>('')
      const [typing, setTyping] = useState<boolean>(false)
      const [loadingMessages, setLoadingMessages] = useState<boolean>(false)
      const [isChatScrolledToBottom, setIsChatScrolledToBottom] = useState(false)

      const { selectedChat } = useChat()
      const { user, chatBackgroundColor } = AuthState()

      const chatRef = useRef<HTMLDivElement>(null)
      const typingTimeoutRef = useRef<Timer | null>(null)
      const scrollToBottomRef = useRef<HTMLDivElement>(null)

      const [isRecording, setIsRecording] = useState(false)

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
            if (!selectedChat) return
            socketService.emit('join chat', selectedChat._id)

            const fetchData = async () => {
                  setLoadingMessages(true)
                  await fetchMessages()
                  setLoadingMessages(false)
                  scrollToBottom(chatRef)
            }

            fetchData()
      }, [selectedChat])

      useEffect(() => {
            const handleScroll = () => {
                const { scrollTop, scrollHeight, clientHeight } = chatRef.current!
                setIsChatScrolledToBottom(scrollHeight - scrollTop <= clientHeight)
            }
        
            chatRef.current?.addEventListener('scroll', handleScroll)
        
            return () => {
                chatRef.current?.removeEventListener('scroll', handleScroll)
            }
        }, [])

      async function handleSubmit (e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLTextAreaElement>) {
            e.preventDefault()
            if (!newMessage || !selectedChat) return

            // Optimistic Update: Add the new message to the state immediately
            const optimisticMessage: IMessage = {
                  _id: 'temp-id',
                  sender: user!,
                  content: newMessage,
                  chat: selectedChat,
                  messageType: 'text',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
            }

            setNewMessage('')
            setMessages([...messages, optimisticMessage])
            setChatOnTop(optimisticMessage)

            scrollToBottom(chatRef)

            try {
                  socketService.emit('stop typing', selectedChat?._id)
                  const messageToUpdate = await chatService.sendMessage({ content: newMessage, chatId: selectedChat?._id, messageType: 'text' })

                  setMessages((prevMessages) =>
                        prevMessages.map((message) => (message._id === 'temp-id' ? messageToUpdate : message))
                  )
                  socketService.emit('new message', messageToUpdate)

            } catch (error) {
                  console.error('Failed to send message:', error)
                  setMessages([...messages])
            }
      }

      function typingHandler (e: React.ChangeEvent<HTMLTextAreaElement>) {
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

      const handleSendAudio = async (audioBlob: Blob, recordingTimer: number): Promise<void> => {
            try {
                  const url = await uploadAudio(audioBlob)
                  onSendMessage(url, 'audio', recordingTimer)
            } catch (error) {
                  console.error('Error uploading audio:', error)
            }
      }

      const isMessageEmpty = !newMessage || newMessage.trim() === ''

      return (
            <>
                  <div
                        className={`overflow-y-auto overflow-x-hidden slide-left h-full bg-no-repeat bg-cover bg-center scroll-smooth ${loadingMessages && 'blur-[2px]'}`}
                        style={{ background: chatBackgroundColor }}
                        ref={chatRef}
                  >
                        <div
                              className='absolute right-0 top-0  w-full min-h-full scroll-smooth'
                              style={{ backgroundImage: 'url(imgs/chat/background.png)' }}

                        >
                              {messages &&
                                    <ChatMessages messages={messages} setChatMode={setChatMode} />
                              }
                        </div>
                  </div>

                  <div className='min-h-[64px] flex items-center md:pl-4 gap-x-3 overflow-x-hidden'>
                        {!isRecording && <AddFileModal setFile={setFile} setChatMode={setChatMode} />}

                        <form onSubmit={handleSubmit} className='w-full flex items-center'>
                              {!isRecording && (
                                    <textarea
                                          className='bg-gray-100 w-full h-10 overflow-hidden transition-all duration-200 resize-none px-4 rounded-xl py-2 focus-visible:outline-none focus:h-20 focus:overflow-y-auto focus:my-4'
                                          placeholder='Type a message...'
                                          value={newMessage}
                                          onChange={typingHandler}
                                          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                      handleSubmit(e)
                                                }
                                          }}
                                    />
                              )}

                              {isMessageEmpty ? (
                                    <AudioRecorder onSendAudio={handleSendAudio} isRecording={isRecording} setIsRecording={setIsRecording} />
                              ) : (
                                    <button disabled={isMessageEmpty} type='submit'
                                          className={`text-primary dark:text-dark-primary-text ml-2 transition-all duration-200 ease-in whitespace-nowrap hover:bg-primary dark:hover:bg-dark-primary-bg hover:text-white p-2 rounded-lg
                                    ${isMessageEmpty ? 'disabled:!text-gray-400 disabled:cursor-not-allowed  ' : ''}`
                                          }>
                                          Send
                                    </button>
                              )}
                        </form>
                  </div>

                  <div ref={scrollToBottomRef} className={`absolute right-2 bottom-20 h-10 w-10 rounded-full flex items-center justify-center bg-[#0000005a] text-white cursor-pointer ${isChatScrolledToBottom ? 'hidden' : ''}`} onClick={() => scrollToBottom(chatRef)}>
                        <KeyboardArrowDownIcon />
                  </div>
            </>

      )
}

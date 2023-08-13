import useChat from '../../../store/useChat'
import { useEffect, useRef, useState } from 'react'
import { chatService } from '../../../services/chat.service'
import { IMessage } from '../../../model/message.model'
import ChatMessages from './ChatMessages'

import { AuthState } from '../../../context/useAuth'
import socketService from '../../../services/socket.service'
import AddFileModal from './AddFileModal'
import { formatRecordTimer, scrollToBottom } from '../../../utils/functions'

import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'

import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import { uploadAudio } from '../../../utils/cloudinary'

interface Props {
      setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
      setChatMode: React.Dispatch<React.SetStateAction<string>>
      setFile: React.Dispatch<React.SetStateAction<File | null>>
      messages: IMessage[]
      setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
      fetchMessages: () => Promise<void>
      onSendMessage: (message: string | File, messageType: "text" | "image" | "audio" | "file", recordTimer?: number) => Promise<void>
}
type Timer = NodeJS.Timeout | number

export default function Chat ({ setIsTyping, setChatMode, setFile, messages, setMessages, fetchMessages, onSendMessage }: Props): JSX.Element {

      const [newMessage, setNewMessage] = useState<string>('')
      const [typing, setTyping] = useState<boolean>(false)
      const [loadingMessages, setLoadingMessages] = useState<boolean>(false)

      const { selectedChat, setChatOnTop } = useChat()
      const { user, chatBackgroundColor } = AuthState()

      const chatRef = useRef<HTMLDivElement>(null)
      const typingTimeoutRef = useRef<Timer | null>(null)

      const [isRecording, setIsRecording] = useState(false)
      const [recordTimer, setRecordTimer] = useState(0)

      const mediaRecorderRef = useRef<MediaRecorder | null>(null)
      const chunksRef = useRef<Blob[]>([])
      const startTimeRef = useRef<Timer | null>(null)

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

      async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
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

      useEffect(() => {
            let timerId
            if (isRecording) {
                  startTimeRef.current = performance.now()
                  timerId = setInterval(() => {
                        if (startTimeRef.current !== null) {
                              const elapsedTime = performance.now() - +startTimeRef.current
                              setRecordTimer(Math.floor(elapsedTime))
                        }
                  }, 1000)
            } else {
                  clearInterval(timerId) 
                  if (startTimeRef.current !== null) {
                        const elapsedTime = performance.now() - +startTimeRef.current
                        setRecordTimer(Math.floor(elapsedTime))
                  }
                  startTimeRef.current = null
            }

            return () => clearInterval(timerId) 
      }, [isRecording])

      const handleRecord = async () => {
            if (!isRecording) {
                  try {
                        chunksRef.current = []
                        setRecordTimer(0)

                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                        mediaRecorderRef.current = new MediaRecorder(stream)

                        mediaRecorderRef.current.ondataavailable = (e) => {
                              if (e.data.size > 0) {
                                    chunksRef.current.push(e.data)
                              }
                        }

                        mediaRecorderRef.current.onstop = async () => {
                              const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
                              setIsRecording(false)

                              try {
                                    const url = await uploadAudio(audioBlob)
                                    if (url !== undefined) {
                                          console.log(recordTimer)
                                          onSendMessage(url, 'audio' , recordTimer)
                                          console.log(url)
                                    }
                              } catch (err) {
                                    console.log(err)
                              }

                              mediaRecorderRef.current = null
                              stream.getTracks().forEach((track) => track.stop())
                        }

                        mediaRecorderRef.current.start()

                        setIsRecording(true)
                  } catch (error) {
                        console.error('Error accessing media devices:', error)
                        setIsRecording(false)
                  }
            } else {
                  mediaRecorderRef.current?.stop()
            }
      }

      const isMessageEmpty = !newMessage || newMessage.trim() === ''

      return (
            <>
                  <div
                        className={`overflow-auto slide-left bg-no-repeat bg-cover bg-center ${loadingMessages && 'blur-[2px]'}`}
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

                  <div className='py-3 flex items-center md:px-4 gap-x-3 overflow-x-hidden'>
                        <AddFileModal setFile={setFile} setChatMode={setChatMode} />

                        <form onSubmit={handleSubmit} className='w-full flex items-center'>

                              {!isRecording ? (<input
                                    type="text"
                                    className='bg-gray-100 w-full px-4 rounded-xl py-2 focus-visible:outline-none'
                                    placeholder='Type a message...'
                                    value={newMessage}
                                    onChange={typingHandler}
                              />) : (
                                    <p>{formatRecordTimer(recordTimer)}</p>
                              )}

                              {isMessageEmpty ? (
                                    <div onClick={handleRecord}>
                                          {isRecording ? (
                                                <PauseCircleOutlineIcon className="text-red-500" />
                                          ) : (
                                                <KeyboardVoiceIcon className='text-gray-500 dark:text-gray-200 mx-4 md:ml-4 md:mx-0 !transition-colors duration-300 cursor-pointer dark:hover:text-dark-primary-text hover:text-gray-700' />
                                          )}
                                    </div>
                              ) : (
                                    <button disabled={isMessageEmpty} type='submit'
                                          className={`text-primary ml-2 transition-all duration-200 ease-in whitespace-nowrap hover:bg-primary hover:text-white p-2 rounded-lg
                                    ${isMessageEmpty ? 'disabled:!text-gray-400 disabled:cursor-not-allowed  ' : ''}`
                                          }>
                                          Send
                                    </button>
                              )}
                        </form>
                  </div>
            </>

      )
}

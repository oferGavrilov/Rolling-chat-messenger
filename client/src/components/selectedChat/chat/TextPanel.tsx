import React, { useRef, useState } from 'react'

import AddFileModal from './AddFileModal'
import AudioRecorder from './AudioRecorder'

import { AuthState } from '../../../context/useAuth'
import useChat from '../../../store/useChat'

import socketService from '../../../services/socket.service'
import { uploadAudio } from '../../../utils/cloudinary'
import MessageArrow from '../../../assets/icons/MessageArrow'

type Timer = NodeJS.Timeout | number

interface Props {
      setFile: React.Dispatch<React.SetStateAction<File | null>>
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
      onSendMessage: (message: string | File, messageType: "text" | "image" | "audio" | "file", recordTimer?: number) => Promise<void>
}

export default function TextPanel ({
      setFile,
      setChatMode,
      onSendMessage
}: Props): JSX.Element {

      const [newMessage, setNewMessage] = useState<string>('')
      const [typing, setTyping] = useState<boolean>(false)
      const [isRecording, setIsRecording] = useState(false)
      const typingTimeoutRef = useRef<Timer | null>(null)

      const { selectedChat } = useChat()
      const { user: loggedInUser } = AuthState()

      async function handleSubmit (e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLTextAreaElement>) {
            e.preventDefault()
            if (!newMessage || !selectedChat) return

            onSendMessage(newMessage, 'text')
            setNewMessage('')
            setTyping(false)

            socketService.emit('stop typing', { chatId: selectedChat?._id, userId: loggedInUser?._id })
      }

      function typingHandler (e: React.ChangeEvent<HTMLTextAreaElement>) {
            const { value } = e.target
            setNewMessage(value)

            if (!typing) {
                  setTyping(true)
                  socketService.emit('typing', { chatId: selectedChat?._id, userId: loggedInUser?._id })
            }

            if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current)
            }

            const timerLength = 2000
            typingTimeoutRef.current = setTimeout(() => {
                  socketService.emit('stop typing', { chatId: selectedChat?._id, userId: loggedInUser?._id })
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
            <div className='flex items-center md:pl-4 gap-x-3 overflow-x-hidden bg-white dark:bg-dark-secondary-bg'>
                  {!isRecording && <AddFileModal setFile={setFile} setChatMode={setChatMode} />}

                  <form onSubmit={handleSubmit} className='w-full flex items-center'>
                        {!isRecording && (

                              <div className='relative w-full'>
                                    <textarea
                                          className='bg-gray-200 flex dark:text-white dark:bg-[#2a3942] w-full h-10 overflow-hidden transition-all duration-200 resize-none px-4 rounded-xl rounded-br-none py-2 focus-visible:outline-none  focus:overflow-y-auto '
                                          placeholder='Type a message...'
                                          value={newMessage}
                                          onChange={typingHandler}
                                          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                      handleSubmit(e)
                                                }
                                          }}
                                    />
                                    <MessageArrow className="input-arrow" fill='#e5e7eb'/>
                              </div>
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
      )
}

import React, { useCallback, useRef, useState } from 'react'

import AddFileModal from './AddFileModal'
import AudioRecorder from './AudioRecorder'

import { AuthState } from '../../../context/useAuth'
import useStore from '../../../context/store/useStore'

import socketService from '../../../services/socket.service'
import { uploadAudio } from '../../../utils/cloudinary'

import MessageArrow from '../../svg/MessageArrow'
import SendIcon from '@mui/icons-material/Send'

import EmojiPicker, { Theme } from 'emoji-picker-react'

import { useClickOutside } from '../../../custom-hook/useClickOutside'
import { IReplyMessage } from '../../../model/message.model'
import { IFile } from '../../../model/chat.model'

type Timer = NodeJS.Timeout | number

interface Props {
      setFile: React.Dispatch<React.SetStateAction<IFile | null>>
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
      onSendMessage: (message: string, type: 'text' | 'image' | 'audio' | 'file', replyMessageId: IReplyMessage | null, recordingTimer?: number) => void
}

export default function TextPanel({
      setFile,
      setChatMode,
      onSendMessage
}: Props): JSX.Element {

      const [newMessage, setNewMessage] = useState<string>('')
      const [typing, setTyping] = useState<boolean>(false)
      const [isRecording, setIsRecording] = useState<boolean>(false)
      const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)

      const typingTimeoutRef = useRef<Timer | null>(null)
      const emojiRef = useRef<HTMLDivElement>(null)

      useClickOutside(emojiRef, () => setShowEmojiPicker(false), showEmojiPicker)

      const { selectedChat, replyMessage, setReplyMessage } = useStore()
      const { user: loggedInUser } = AuthState()

      const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLTextAreaElement>) => {
            e.preventDefault();
            if (!newMessage.trim() || !selectedChat) return;

            onSendMessage(newMessage.trim(), 'text', replyMessage || null);
            setNewMessage('');
            setTyping(false);
            socketService.emit('stop typing', { chatId: selectedChat._id, userId: loggedInUser?._id });
      }, [newMessage, onSendMessage, replyMessage, selectedChat, loggedInUser]);

      const typingHandler = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const { value } = e.target
            setNewMessage(value)

            if (value.length > 200) {
                  e.target.style.border = '1px solid red'
            } else {
                  e.target.style.border = 'none'
            }

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
      }, [typing, selectedChat, loggedInUser]);

      const handleSendAudio = async (audioBlob: Blob, recordingTimer: number): Promise<void> => {
            try {
                  const url = await uploadAudio(audioBlob)
                  onSendMessage(url, 'audio', replyMessage ? replyMessage : null, recordingTimer)
            } catch (error) {
                  console.error('Error uploading audio:', error)
            }
      }

      const handleEmojiClick = ({ emoji }) => {
            setNewMessage(prevMessage => prevMessage + emoji)
      }

      const isMessageEmpty = !newMessage || newMessage.trim() === ''

      return (
            <>
                  <div className='flex items-center md:pl-4 gap-x-3 overflow-x-hidden bg-gray-50 dark:bg-dark-secondary-bg relative'>
                        {!isRecording && <AddFileModal setFile={setFile} setChatMode={setChatMode} />}

                        <form onSubmit={handleSubmit} className='w-full flex items-center h-full py-3' id='text-panel-form'>
                              {!isRecording && (

                                    <div className='relative w-full h-full flex items-center'>
                                          <div className={`bg-light-input-bg dark:bg-dark-input-bg rounded-l-xl flex justify-center items-center pl-3 h-full ${showEmojiPicker ? 'pointer-events-none' : ''}`}>
                                                <span className="material-symbols-outlined text-primary cursor-pointer" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>add_reaction</span>
                                          </div>
                                          {showEmojiPicker && <div ref={emojiRef} className='fixed bottom-20 transition-transform duration-200 left-4 md:left-auto'>
                                                <EmojiPicker
                                                      onEmojiClick={handleEmojiClick}
                                                      theme={Theme.AUTO}
                                                      lazyLoadEmojis={true}
                                                      searchDisabled={true}
                                                />
                                          </div>}
                                          <textarea
                                                className='bg-light-input-bg hide-scrollbar flex dark:text-white dark:bg-dark-input-bg w-full h-10 overflow-hidden transition-all duration-200 resize-none px-4 rounded-tr-xl py-2 focus-visible:outline-none focus:overflow-y-auto'
                                                placeholder='Type a message...'
                                                value={newMessage}
                                                name='text-message'
                                                maxLength={201}
                                                onChange={typingHandler}
                                                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                                      if (e.key === 'Enter' && !e.shiftKey) {
                                                            handleSubmit(e)
                                                      }
                                                }}
                                          />
                                          <MessageArrow className="input-arrow" />
                                    </div>
                              )}

                              {isMessageEmpty ? (
                                    <AudioRecorder onSendAudio={handleSendAudio} isRecording={isRecording} setIsRecording={setIsRecording} />
                              ) : (
                                    <button disabled={isMessageEmpty} type='submit'
                                          className={`mx-2 text-white transition-all duration-200 ease-in whitespace-nowrap bg-primary hover:bg-default-hover-bg p-2 rounded-full
                                    ${isMessageEmpty ? 'disabled:!text-gray-400 disabled:cursor-not-allowed' : ''}`
                                          }>
                                          <SendIcon />
                                    </button>
                              )}
                        </form>

                        <div className={`fixed w-full left-0 ease-out text-white rounded-t-xl transition-all duration-300 ${replyMessage ? 'bottom-[64px] max-h-20' : 'max-h-0 [&>*]:p-0 [&>*]:hidden'}`}>
                              <div className="flex items-center h-full bg-gray-50 dark:bg-dark-secondary-bg pt-3 pr-12">
                                    <div className="flex items-center justify-center w-20 ">
                                          <span className="material-symbols-outlined text-[#727e86] text-4xl cursor-pointer" onClick={() => setReplyMessage(null)}>close_small</span>
                                    </div>

                                    <div className='flex bg-[#d2d7de] dark:bg-dark-primary-bg px-4 rounded-lg w-full h-full p-2 border-r-4 border-[#ffb703] dark:border-primary'>
                                          <div className='flex flex-col gap-y-1'>
                                                <span className='text-sm text-[#ffb703] dark:text-primary font-bold'>{replyMessage?.sender._id === loggedInUser?._id ? 'You' : replyMessage?.sender.username}</span>
                                                <span className='overflow-hidden max-w-[300px] text-ellipsis max-h-6 text-gray-50 dark:text-[#8696a0]'>
                                                      {replyMessage?.messageType === 'text' ? replyMessage?.content.toString() : replyMessage?.messageType}
                                                </span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </>
      )
}

import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import useChat from '../../../store/useChat'
import { IReplyMessage } from '../../../model/message.model'
import { IFile } from '../../../model/chat.model'

interface Props {
      file: IFile | null
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
      sendMessage: (message: string, type: 'text' | 'image' | 'audio' | 'file', replyMessage: IReplyMessage | null, recordingTimer?: number) => void
}

export default function FileEditor ({ file, setChatMode, sendMessage }: Props) {

      const { replyMessage } = useChat()
      if (!file) return <div></div>

      const isImage = typeof file === 'string'

      function onSendMessage () {
            const type = isImage ? 'image' : 'file'
            const message = isImage ? file : file?.url
            sendMessage(message as string, type, replyMessage ? replyMessage : null, undefined)
      }

      return (
            <div className='bg-white h-full dark:bg-dark-secondary-bg relative'>
                  <div className={`flex justify-center w-full h-full ${isImage && 'items-center'}`}>
                        {isImage ? (
                              <img
                                    src={file}
                                    alt="picked-file"
                                    className="object-contain max-w-[240px] md:max-w-sm drop-shadow-2xl -mt-24 md:-mt-16"
                              />
                        ) : (
                              <iframe
                                    src={file.url}
                                    title="picked-pdf"
                                    className="w-full h-[400px] md:h-[700px] mt-12"
                              ></iframe>
                        )}
                  </div>
                  <CloseIcon
                        className='absolute top-4 right-4 text-black dark:text-white cursor-pointer'
                        color='inherit'
                        onClick={() => setChatMode('chat')}
                  />

                  <div className='border-t-4 border-gray-300 dark:border-dark-primary-bg py-5 w-full absolute bottom-0'>
                        <div onClick={onSendMessage}
                              className='mx-4 bg-primary w-12 h-12 rounded-full text-white flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer shadow-gray-950 shadow-md'>
                              <SendIcon className='rotate-180' />
                        </div>
                  </div>
            </div>
      )
}

import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import useStore from '../../../context/store/useStore'
import { IReplyMessage } from '../../../model/message.model'

interface Props {
      file: File | null
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
      sendMessage: (message: string, type: 'text' | 'image' | 'audio' | 'file', replyMessage: IReplyMessage | null, recordingTimer?: number) => void
}

export default function FileEditor({ file, setChatMode, sendMessage }: Props) {
      const { replyMessage } = useStore()
      const [fileSrc, setFileSrc] = useState<string | null>(null)
      const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true)

      useEffect(() => {
            if (typeof file === 'string') {
                  setFileSrc(file)
                  setIsLoadingImage(false)
            } else if (file) {
                  setIsLoadingImage(true)
                  const reader = new FileReader()
                  reader.onload = (e) => {
                        setFileSrc(e.target?.result as string)
                        setIsLoadingImage(false)
                  }
                  reader.readAsDataURL(file)
            }
      }, [file])

      const isImage = file && file.type && file.type.startsWith('image/')

      function onSendMessage(): void {
            if (!file || !fileSrc) return

            const type = file.type.startsWith('image/') ? 'image' : 'file'

            sendMessage(fileSrc, type, replyMessage, file.size)
      }

      return (
            <div className='bg-white h-full dark:bg-dark-secondary-bg relative'>

                  <div className={`flex justify-center w-full h-full ${isImage && 'items-center'}`}>
                        {!isLoadingImage ? (
                              <>
                                    {isImage ? (
                                          <img
                                                src={fileSrc as string}
                                                alt="picked-file"
                                                className="object-contain max-w-[240px] md:max-w-md drop-shadow-2xl -mt-24 md:-mt-28"
                                          />
                                    ) : (
                                          <iframe
                                                src={fileSrc as string}
                                                title="picked-pdf"
                                                allowFullScreen={true}
                                                className="w-4/5 h-[400px] md:h-[700px]"
                                          ></iframe>
                                    )}
                              </>
                        ) : (
                              <div className='spinner' />
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
            </div >

      )
}

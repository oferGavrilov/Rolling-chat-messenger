import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'

interface Props {
      file: any | null
      setChatMode: React.Dispatch<React.SetStateAction<string>>
      sendMessage: (file: File, type: "text" | "image" | "audio" | "file") => void
}

export default function FileEditor ({ file, setChatMode, sendMessage }: Props) {

      if (!file) return <div></div>
      
      const isImage = typeof file === 'string'

      function onSendMessage () {
            const type = isImage ? 'image' : 'file'
            const message = isImage ? file : file.url
            sendMessage(message, type)
      }
      return (
            <div className='bg-gradient-to-b from-blue-100 to-white relative'>
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
                                    className="w-full h-[400px] md:h-[700px] mt-12 shadow-xl shadow-gray-400"
                              ></iframe>
                        )}
                  </div>
                  <CloseIcon
                        className='absolute top-4 right-4 text-white cursor-pointer'
                        color='inherit'
                        onClick={() => setChatMode('chat')}
                  />

                  <div className='border-t-2 border-gray-300 py-5 w-full absolute bottom-0'>
                        <div onClick={onSendMessage}
                              className='mx-4 bg-primary w-10 h-10 rounded-full text-white inline-flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer'>
                              <SendIcon className='rotate-180' fontSize='small' />
                        </div>
                  </div>
            </div>
      )
}
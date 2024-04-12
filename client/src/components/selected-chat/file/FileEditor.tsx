import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import useStore from '../../../context/store/useStore'
import { IReplyMessage } from '../../../model/message.model'
import { useClickOutside } from '../../../custom-hook/useClickOutside'

interface Props {
      file: File | null
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "edit-file">>
      sendMessage: (message: string, type: 'text' | 'image' | 'audio' | 'file', replyMessage: IReplyMessage | null, recordingTimer?: number, file?: File) => Promise<void>
}

export default function FileEditor({ file, setChatMode, sendMessage }: Props) {
      const { replyMessage } = useStore()
      const [fileSrc, setFileSrc] = useState<string | null>(null)
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const fileEditorRef = React.createRef<HTMLDivElement>()

      useClickOutside(fileEditorRef, () => setChatMode('chat'), true)

      useEffect(() => {
            if (file) {
                  const objectUrl = URL.createObjectURL(file)
                  setFileSrc(objectUrl)
            }
      }, [file])

      const isImage = file && file.type.startsWith('image/')

      async function uploadFileAndSend(): Promise<void> {
            if (!file || !fileSrc) return
            const type = isImage ? 'image' : 'file'
            setIsLoading(true)
            try {
                  setChatMode('chat')
                  URL.revokeObjectURL(fileSrc)
                  await sendMessage('', type, replyMessage, file.size, file)

            } catch(err) {
                  console.error('Failed to upload file:', err)
            } finally {
                  setIsLoading(false)
            }
      }

      if (!fileSrc) return <div></div>
      return (
            <div className='bg-white h-full dark:bg-dark-secondary-bg relative' ref={fileEditorRef}>
                  <div className={`flex justify-center w-full h-full ${isImage && 'items-center'}`}>
                        {isImage ? (
                              <img
                                    src={fileSrc}
                                    alt="picked-file"
                                    className="object-contain max-w-[240px] md:max-w-96 drop-shadow-2xl -mt-20"
                              />
                        ) : (
                              <iframe
                                    src={fileSrc}
                                    title="picked-file"
                                    allowFullScreen={true}
                                    className="w-4/5 h-[400px] md:h-[700px]"
                              ></iframe>
                        )
                        }
                  </div>
                  {!isLoading && (
                        <CloseIcon
                              className='absolute top-4 right-4 text-black dark:text-white cursor-pointer'
                              role='button'
                              aria-label='close'
                              tabIndex={1}
                              color='inherit'
                              titleAccess='close file editor'
                              onClick={() => setChatMode('chat')}
                        />
                  )}

                  <div className='py-5 w-full absolute bottom-2 left-2'>
                        <button onClick={uploadFileAndSend}
                              role='button'
                              aria-label='send file'
                              tabIndex={0}
                              title="Send File"
                              disabled={isLoading}
                              className={`mx-4 bg-primary w-12 h-12 rounded-full text-white flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer shadow-gray-950 shadow-md `}>

                              {isLoading ? (
                                    <div className='spinner'></div>
                              ) : (
                                    <SendIcon className='rotate-180' />
                              )}
                        </button>
                  </div>
            </div>
      )
}

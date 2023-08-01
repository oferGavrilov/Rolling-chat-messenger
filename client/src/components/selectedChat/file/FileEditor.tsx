import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send';

interface Props {
      file: File | null
      setChatMode: React.Dispatch<React.SetStateAction<string>>
      onSendMessage: (message: string | File) => Promise<void>

}

export default function FileEditor ({ file, setChatMode, onSendMessage }: Props) {

      console.log(file)

      if (!file) return <div></div>
      return (
            <div className='bg-gradient-to-b from-blue-100 to-white relative'>
                  <div className='flex items-center justify-center w-full h-full'>
                        <img
                              src={file.toString()}
                              alt="picked-file"
                              className="object-contain max-w-[240px] md:max-w-sm drop-shadow-2xl -mt-24 md:-mt-16"
                        />
                  </div>
                  <CloseIcon
                        className='absolute top-4 right-4 text-white cursor-pointer'
                        color='inherit'
                        onClick={() => setChatMode('chat')}
                  />

                  <div className='border-t-2 border-gray-300 py-5 w-full absolute bottom-0'>
                        <div onClick={() => onSendMessage(file)}
                              className='mx-4 bg-primary w-10 h-10 rounded-full text-white inline-flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer'>
                              <SendIcon className='rotate-180' fontSize='small' />
                              {/* <button className='bg-primary text-white p-2 rounded-xl' onClick={() => onSendMessage(file)}>Send File</button> */}
                        </div>
                  </div>
            </div>
      )
}

import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
      file: File | null
      setChatMode: React.Dispatch<React.SetStateAction<string>>
}

export default function FileEditor ({ file, setChatMode }: Props) {
      console.log(file)

      function onSendFile () {
            setChatMode('chat')
      }

      if (!file) return <div></div>
      return (
            <div className='bg-gray-400 relative'>
                  <div className='flex items-center justify-center w-full h-full'>
                        <img
                              src={file.toString()}
                              alt="picked-file"
                              className="object-contain drop-shadow-2xl -mt-16"
                        />
                  </div>
                  <CloseIcon
                        className='absolute top-4 right-4 text-white cursor-pointer'
                        color='inherit'
                        onClick={() => setChatMode('chat')}
                  />

                  <div className='absolute bottom-10 left-10'>
                        <button className='bg-primary text-white p-2 rounded-xl' onClick={onSendFile}>Send File</button>
                  </div>
            </div>
      )
}

import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
      file: File | null
      setChatMode: React.Dispatch<React.SetStateAction<string>>
      onSendMessage: (message: string | File) => Promise<void>

}

export default function FileEditor ({ file, setChatMode, onSendMessage }: Props) {

      console.log(file)

      if (!file) return <div></div>
      return (
            <div className='bg-gradient-to-b from-blue-200 to-blue-100 relative'>
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

                  <div className='border-t-2 border-gray-300 py-5 w-full absolute bottom-0'>
                        <div className='mx-4'>
                              <button className='bg-primary text-white p-2 rounded-xl' onClick={() => onSendMessage(file)}>Send File</button>
                        </div>
                  </div>
            </div>
      )
}

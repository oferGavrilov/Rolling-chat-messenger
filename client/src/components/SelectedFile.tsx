import { useEffect, useRef } from 'react'
import { AuthState } from '../context/useAuth'
import useChat from '../store/useChat'
import { formatTime } from '../utils/functions'

import ToolTip from '@mui/material/Tooltip'

import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'

export default function SelectedFile (): JSX.Element {
      const { selectedFile, setSelectedFile } = useChat()
      const { user: loggedInUser } = AuthState()
      const headerDivRef = useRef<HTMLDivElement>(null)

      const handleClickOutside = (event: MouseEvent) => {
            if (headerDivRef.current && !headerDivRef.current.contains(event.target as Node)) {
                  setSelectedFile(null)
            }
      }

      useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside)

            return () => {
                  document.removeEventListener('mousedown', handleClickOutside)
            }
      }, [])

      const handleDownload = () => {
            try {
                  const imageUrl = selectedFile?.content?.toString()

                  if (imageUrl) {
                        fetch(imageUrl)
                              .then((response) => response.blob())
                              .then((blob) => {
                                    const blobUrl = URL.createObjectURL(blob)

                                    const link = document.createElement('a')
                                    link.href = blobUrl
                                    link.download = 'downloaded-image.jpg'
                                    link.click()

                                    URL.revokeObjectURL(blobUrl)
                              })
                              .catch((error) => {
                                    console.error('Error fetching the image:', error)
                              })
                  } else {
                        console.error('Image URL is not available.')
                  }
            } catch (error) {
                  console.error('Error downloading the image:', error)
            }
      }

      if (!selectedFile) return <div></div>

      return (
            <div className='flex flex-col fixed top-0 left-0 w-full'>
                  <div className='bg-gray-800'>
                        <div className='flex justify-between px-4 py-3 items-center text-white' ref={headerDivRef}>
                              <div className='flex items-center gap-x-3'>
                                    <ToolTip title="Close" arrow placement='bottom'>
                                          <div className='tools-icon' onClick={() => setSelectedFile(null)}>
                                                <CloseIcon />
                                          </div>
                                    </ToolTip>

                                    <ToolTip title="Download" arrow placement='bottom'>
                                          <div className='tools-icon' onClick={handleDownload}>
                                                <DownloadIcon />
                                          </div>
                                    </ToolTip>
                              </div>

                              <div className='flex'>
                                    <div className='flex flex-col mr-3 justify-between'>
                                          <div className='flex text-white gap-x-2'>
                                                <span>{selectedFile.chat.chatName} @</span>
                                                <span>{selectedFile.sender._id === loggedInUser?._id ? 'You' : selectedFile.sender.username}</span>
                                          </div>
                                          <span className='text-gray-400 text-sm text-right'>{formatTime(selectedFile.createdAt)}</span>
                                    </div>
                                    <img src={selectedFile?.sender.profileImg} alt='' className='w-12 h-12 rounded-full object-cover object-top' />
                              </div>
                        </div>
                  </div>

                  <section className='h-screen w-screen flex flex-col  items-center justify-center z-20' style={{ background: 'rgba(0, 0, 0, 0.9)' }}>
                        <div className='flex justify-center opacity-0 mb-20 fade-grow-up-selected-file'>
                              <img src={selectedFile?.content?.toString()} className='max-w-sm md:max-w-md lg:max-w-lg max-h-[700px] object-cover' alt='' />
                        </div>
                  </section>
            </div>
      )
}

import { useEffect, useRef } from 'react'
import { AuthState } from '../context/useAuth'
import useStore from '../context/store/useStore'

import { formatTime, onDownloadFile } from '../utils/functions'

import ToolTip from '@mui/material/Tooltip'

import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'

export default function SelectedFile (): JSX.Element {
      const { selectedFile, setSelectedFile } = useStore()
      const { user: loggedInUser } = AuthState()

      const headerDivRef = useRef<HTMLDivElement>(null)
      const fileRef = useRef<HTMLImageElement | HTMLIFrameElement | null>(null)

      const handleClickOutside = (event: MouseEvent) => {
            const clickedElement = event.target as HTMLElement

            // Ignore click on the file and the header
            if (headerDivRef.current &&
                  !headerDivRef.current.contains(clickedElement) &&
                  fileRef.current &&
                  !fileRef.current.contains(clickedElement)
            ) {
                  setSelectedFile(null)
            }
      }

      useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside)

            return () => {
                  document.removeEventListener('mousedown', handleClickOutside)
            }
      }, [])

      if (!selectedFile) return <div></div>

      const isImage = selectedFile.messageType === 'image'

      return (
            <div className='flex flex-col fixed top-0 left-0 w-full'>
                  <div className='bg-gray-800 dark:bg-dark-primary-bg'>
                        <div className='flex justify-between px-4 py-2 items-center text-white' ref={headerDivRef}>
                              <div className='flex items-center gap-x-3'>
                                    <ToolTip title="Close" arrow placement='bottom'>
                                          <div className='tools-icon' onClick={() => setSelectedFile(null)}>
                                                <CloseIcon />
                                          </div>
                                    </ToolTip>

                                    {isImage && <ToolTip title="Download" arrow placement='bottom'>
                                          <div className='tools-icon' onClick={() => onDownloadFile(selectedFile)}>
                                                <DownloadIcon />
                                          </div>
                                    </ToolTip>}
                              </div>

                              <div className='flex'>
                                    <div className='flex flex-col mr-3 justify-between'>
                                          <div className='flex text-white gap-x-2'>
                                                <span>{selectedFile.chat?.chatName}@</span>
                                                <span>{selectedFile.sender._id === loggedInUser?._id ? 'You' : selectedFile.sender.username}</span>
                                          </div>
                                          <span className='text-gray-400 dark:text-gray-300 text-sm text-right'>{formatTime(selectedFile.createdAt)}</span>
                                    </div>
                                    <img src={selectedFile?.sender.profileImg} alt='' className='w-12 h-12 rounded-full object-cover' />
                              </div>
                        </div>
                  </div>

                  <section className='h-screen w-screen flex flex-col  items-center justify-center z-20' style={{ background: 'rgba(0, 0, 0, 0.9)' }}>
                        <div className='flex w-full h-full items-center justify-center opacity-0 mb-20 fade-grow-up-selected-file'>
                              {isImage ? (
                                    <img
                                          ref={fileRef as React.MutableRefObject<HTMLImageElement>}
                                          src={selectedFile?.content?.toString()}
                                          className='max-w-full md:max-w-md lg:max-w-lg max-h-[700px] object-cover'
                                          alt='' />
                              ) : (
                                    <iframe
                                          ref={fileRef as React.MutableRefObject<HTMLIFrameElement>}
                                          src={selectedFile?.content?.toString()}
                                          title='picked-pdf'
                                          className='w-full md:w-[700px] h-full md:h-[700px]'
                                    />
                              )}
                        </div>
                  </section>
            </div>
      )
}

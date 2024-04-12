import { useEffect, useRef, useState } from 'react'
import { AuthState } from '../context/useAuth'
import useStore from '../context/store/useStore'

import { formatTime, onDownloadFile } from '../utils/functions'

import ToolTip from '@mui/material/Tooltip'

import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import { BsFiletypePdf } from "react-icons/bs";
import { IMessage } from '../model'
import { useImageNavigator } from '../custom-hook/useImageNavigator'
export default function SelectedFile(): JSX.Element {
      const { selectedFile, setSelectedFile, messages } = useStore()
      const { user: loggedInUser } = AuthState()
      const [filesInChat, setFilesInChat] = useState<IMessage[]>([])
      const {
            currentFile,
            setSelectedFileById,
            canNavigateNext,
            canNavigatePrev,
      } = useImageNavigator(filesInChat, selectedFile)

      const headerDivRef = useRef<HTMLDivElement>(null)
      const fileRef = useRef<HTMLImageElement | HTMLIFrameElement | null>(null)
      const filesInChatRef = useRef<HTMLDivElement>(null)

      const handleNext = () => {
            if (!canNavigateNext || !currentFile) return
            const nextIndex = filesInChat.findIndex(file => file._id === currentFile._id) + 1
            setSelectedFileById(filesInChat[nextIndex]._id)
            // TODO: scroll to the item in the filesInChatRef
      }

      const handlePrevious = () => {
            if (!canNavigatePrev || !currentFile) return
            const prevIndex = filesInChat.findIndex(file => file._id === currentFile._id) - 1
            setSelectedFileById(filesInChat[prevIndex]._id)
            // TODO: scroll to the item in the filesInChatRef
      }

      useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                  switch (event.key) {
                        case 'ArrowRight':
                              handleNext()
                              break
                        case 'ArrowLeft':
                              handlePrevious()
                              break
                  }
            }

            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
      }, [handleNext, handlePrevious])

      useEffect(() => {
            if (!currentFile || !currentFile.chat) return
            const chatId = currentFile.chat._id
            const files = messages.filter(message => message.chat?._id === chatId && message.messageType === 'image' || message.messageType === 'file')
            setFilesInChat(files)
      }, [currentFile, messages])


      // const handleClickOutside = (event: MouseEvent) => {
      //       const clickedElement = event.target as HTMLElement

      //       // Ignore click on the file, the header and the files in chat
      //       if (headerDivRef.current &&
      //             !headerDivRef.current.contains(clickedElement) &&
      //             fileRef.current &&
      //             !fileRef.current.contains(clickedElement) &&
      //             filesInChatRef.current &&
      //             !filesInChatRef.current.contains(clickedElement)
      //       ) {
      //             setSelectedFile(null)
      //       }
      // }

      // useEffect(() => {
      //       document.addEventListener('mousedown', handleClickOutside)

      //       return () => {
      //             document.removeEventListener('mousedown', handleClickOutside)
      //       }
      // }, [])

      if (!currentFile) return <div></div>

      const isImage = currentFile.messageType === 'image'

      return (
            <div className='flex flex-col fixed top-0 left-0 w-full'>
                  <header className='bg-gray-800 dark:bg-dark-primary-bg'>
                        <div className='flex justify-between px-4 py-2 items-center text-white' ref={headerDivRef}>
                              <div className='flex items-center gap-x-3'>
                                    <ToolTip title="Close" arrow placement='bottom'>
                                          <div className='tools-icon' onClick={() => setSelectedFile(null)}>
                                                <CloseIcon />
                                          </div>
                                    </ToolTip>

                                    {isImage && <ToolTip title="Download" arrow placement='bottom'>
                                          <div className='tools-icon' onClick={() => onDownloadFile(currentFile)}>
                                                <DownloadIcon />
                                          </div>
                                    </ToolTip>}
                              </div>

                              <div className='flex'>
                                    <div className='flex flex-col mr-3 justify-between'>
                                          <div className='flex text-white gap-x-2'>
                                                {currentFile.chat?.chatName && <span>{currentFile.chat?.chatName}@</span>}
                                                <span>{currentFile.sender._id === loggedInUser?._id ? 'You' : currentFile.sender.username}</span>
                                          </div>
                                          <span className='text-gray-400 dark:text-gray-300 text-sm text-right'>{formatTime(currentFile.createdAt)}</span>
                                    </div>
                                    <img src={currentFile?.sender.profileImg} alt='' className='w-12 h-12 rounded-full object-cover' />
                              </div>
                        </div>
                  </header>

                  <main className='h-screen w-screen flex flex-col items-center z-20' style={{ background: 'rgba(0, 0, 0, 0.9)' }}>
                        <button
                              onClick={handlePrevious}
                              disabled={!canNavigatePrev}
                              className='absolute top-1/2 left-8 -translate-y-1/2 z-30 p-1 backdrop-blur-sm bg-white/30 rounded-full text-3xl leading-none text-white disabled:opacity-35 disabled:cursor-not-allowed material-symbols-outlined'
                        >
                              navigate_before
                        </button>
                        <button
                              onClick={handleNext}
                              disabled={!canNavigateNext}
                              className='absolute top-1/2 right-8 -translate-y-1/2 z-30 p-1 backdrop-blur-sm bg-white/30 rounded-full text-3xl leading-none text-white disabled:opacity-35 disabled:cursor-not-allowed material-symbols-outlined'
                        >
                              navigate_next
                        </button>
                        <div className='flex flex-col w-full h-full items-center mt-8 opacity-0 mb-20 fade-grow-up-selected-file'>
                              {isImage ? (
                                    <div className='w-4/5 max-w-[90%] max-h-[70vh] flex items-center justify-center'>
                                          <img
                                                ref={fileRef as React.MutableRefObject<HTMLImageElement>}
                                                src={currentFile.fileUrl}
                                                className='max-w-full max-h-full object-cover rounded-lg'
                                                alt={`${currentFile.sender.username} sent this image.`}
                                          />
                                    </div>
                              ) : (
                                    <iframe
                                          ref={fileRef as React.MutableRefObject<HTMLIFrameElement>}
                                          src={selectedFile?.fileUrl}
                                          title='picked-pdf'
                                          className='w-4/5 h-4/5'
                                    />
                              )}

                        </div>
                  </main>


                  <footer className='fixed bottom-0 w-full z-30 flex items-center py-4' ref={filesInChatRef}>
                        <div className='flex py-2 overflow-x-auto gap-x-2 w-screen overflow-hidden h-32'>
                              {filesInChat.map(file => (
                                    <div
                                          key={file._id}
                                          className={`flex flex-col flex-shrink-0 items-center gap-y-2 relative cursor-pointer object-cover w-[78px] h-[78px] rounded-lg hover:scale-110 transition-transform duration-300 ${currentFile._id === file._id ? 'border-2 border-primary' : ''}`}
                                          onClick={() => setSelectedFileById(file._id)}
                                          role='button'
                                          tabIndex={0}
                                          aria-label='View image in full screen'
                                    >
                                          {file.messageType === 'image' ?
                                                (
                                                      <img
                                                            src={file.fileUrl}
                                                            className='object-cover rounded-lg h-full w-full'
                                                            alt={`${file.sender.username} sent this image.`}
                                                            title='View image in full screen'
                                                      />
                                                ) : (
                                                      <div className='bg-[#f14545] w-full h-full rounded-lg text-center flex items-center justify-center flex-col'>
                                                            <BsFiletypePdf className='text-gray-500 dark:text-gray-300 w-6 h-6' />
                                                            <span className='text-white dark:text-gray-300 text-[11px] -mb-2 mt-2'>{file.sender.username}</span>
                                                      </div>
                                                )}
                                          <span className='absolute -bottom-6 text-white dark:text-gray-300 text-xs'>{formatTime(file.createdAt)}</span>
                                    </div>
                              ))}
                        </div>
                  </footer>
            </div>
      )
}

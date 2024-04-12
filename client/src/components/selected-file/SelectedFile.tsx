import { useEffect, useRef, useState } from 'react'
import { AuthState } from '../../context/useAuth'
import useStore from '../../context/store/useStore'

import { formatTime, onDownloadFile } from '../../utils/functions'

import ToolTip from '@mui/material/Tooltip'

import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import { IMessage } from '../../model'
import { useImageNavigator } from '../../custom-hook/useImageNavigator'
import FilesInChat from './filesInChat/FilesInChat'
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

      const headerRef = useRef<HTMLElement>(null)
      const fileRef = useRef<HTMLImageElement | HTMLIFrameElement>(null)
      const filesInChatRef = useRef<HTMLDivElement>(null)
      const nextButtonRef = useRef<HTMLButtonElement>(null)
      const prevButtonRef = useRef<HTMLButtonElement>(null)

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


      const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node

            // Check if the click is inside any of the known refs
            if (headerRef.current?.contains(target) ||
                  fileRef.current?.contains(target) ||
                  filesInChatRef.current?.contains(target) ||
                  nextButtonRef.current?.contains(target) ||
                  prevButtonRef.current?.contains(target)) {
                  return
            }

            setSelectedFile(null);
      }

      useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                  document.removeEventListener('mousedown', handleClickOutside);
            };
      }, [handleClickOutside, setSelectedFile])

      if (!currentFile) return <div></div>

      const isImage = currentFile.messageType === 'image'

      return (
            <div className='flex flex-col fixed top-0 left-0 w-full'>
                  <header className='bg-gray-800 dark:bg-dark-primary-bg' ref={headerRef}>
                        <div className='flex justify-between px-4 py-2 items-center text-white'>
                              <div className='flex items-center gap-x-3'>
                                    <ToolTip title="Close" arrow placement='bottom'>
                                          <div className='tools-icon' onClick={() => setSelectedFile(null)}>
                                                <CloseIcon />
                                          </div>
                                    </ToolTip>

                                    <ToolTip title="Download" arrow placement='bottom'>
                                          <div className='tools-icon' onClick={() => onDownloadFile(currentFile)}>
                                                <DownloadIcon />
                                          </div>
                                    </ToolTip>
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

                  <main className='h-screen w-screen flex flex-col items-center z-20' style={{ background: 'rgba(0, 0, 0, 0.9)', height: 'calc(100vh - 64px)' }}>
                        <button
                              onClick={handlePrevious}
                              disabled={!canNavigatePrev}
                              ref={prevButtonRef}
                              className='absolute top-[50%] left-8 -translate-y-1/2 z-30 p-1 backdrop-blur-sm bg-white/30 rounded-full text-3xl leading-none text-white disabled:opacity-35 disabled:cursor-not-allowed material-symbols-outlined'
                        >
                              navigate_before
                        </button>
                        <button
                              onClick={handleNext}
                              disabled={!canNavigateNext}
                              ref={nextButtonRef}
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
                                          src={currentFile?.fileUrl}
                                          title='picked-pdf'
                                          className='w-4/5 h-4/5'
                                    />
                              )}

                        </div>
                  </main>

                  <footer className='fixed bottom-0 w-full z-30 flex items-center py-4'>
                        <div className='flex p-2 overflow-x-auto gap-x-3 w-screen overflow-hidden h-32' ref={filesInChatRef}>
                              <FilesInChat
                                    files={filesInChat}
                                    setSelectedFileById={setSelectedFileById}
                                    currentFileId={currentFile._id}
                              />
                        </div>
                  </footer>
            </div>
      )
}

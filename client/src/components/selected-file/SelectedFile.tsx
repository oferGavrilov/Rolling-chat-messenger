import { useEffect, useRef, useState } from 'react'
import { AuthState } from '../../context/useAuth'
import useStore from '../../context/store/useStore'
import { formatTime, onDownloadFile } from '../../utils/functions'
import { IMessage } from '../../model'
import { useImageNavigator } from '../../custom-hook/useImageNavigator'
import FilesInChat from './filesInChat/FilesInChat'
import Avatar from '../common/Avatar'

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
      }

      const handlePrevious = () => {
            if (!canNavigatePrev || !currentFile) return
            const prevIndex = filesInChat.findIndex(file => file._id === currentFile._id) - 1
            setSelectedFileById(filesInChat[prevIndex]._id)
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
                        case 'Escape':
                              setSelectedFile(null)
                              break
                  }
            }

            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
      }, [handleNext, handlePrevious])

      useEffect(() => {
            if (!currentFile || !currentFile.chat) return

            document.title = `Rolling - ${currentFile.fileName}`
            const chatId = currentFile.chat._id
            const files = messages.filter(message => message.chat?._id === chatId && message.messageType === 'image' || message.messageType === 'file')
            setFilesInChat(files)

            return () => {
                  document.title = 'Rolling'
            }
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

            setSelectedFile(null)
      }

      useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside)

            return () => {
                  document.removeEventListener('mousedown', handleClickOutside)
            }
      }, [handleClickOutside, setSelectedFile])

      if (!currentFile) return <div></div>

      const isImage = currentFile.messageType === 'image'

      return (
            <div className='flex flex-col fixed top-0 left-0 w-full'>
                  <header className='bg-gray-800 dark:bg-dark-primary-bg' ref={headerRef}>
                        <div className='flex justify-between px-4 py-2 items-center text-white'>
                              <div className='flex items-center gap-x-3'>
                                    <div
                                          className='tools-icon material-symbols-outlined'
                                          onClick={() => setSelectedFile(null)}
                                          role='button'
                                          title='Close'
                                          aria-label='Close selected file modal'
                                    >
                                          close
                                    </div>

                                    <div
                                          className='tools-icon material-symbols-outlined'
                                          onClick={() => onDownloadFile(currentFile)}
                                          role='button'
                                          title='Download'
                                          aria-label={`Download the current file sent by ${currentFile.sender.username}, and named ${currentFile.fileName}.`}
                                    >
                                          download
                                    </div>

                                    <div
                                          className='tools-icon material-symbols-outlined'
                                          role='button'
                                          title='Share file on WhatsApp'
                                          aria-label='Share file on WhatsApp'
                                          onClick={() => {
                                                const url = currentFile.fileUrl
                                                const message = `Check out this file sent by ${currentFile.sender.username} on WhatsApp.`
                                                window.open(`https://wa.me/?text=${encodeURIComponent(message + '\n' + url)}`)
                                          }}
                                    >
                                          share
                                    </div>
                              </div>

                              <div className='flex text-sm tracking-widest leading-none'>
                                    <div className='flex flex-col justify-center'>
                                          <div className='flex text-white gap-x-2'>
                                                {currentFile.chat?.chatName && <span>{currentFile.chat?.chatName}@</span>}
                                                <span>{currentFile.sender._id === loggedInUser?._id ? 'You' : currentFile.sender.username}</span>
                                          </div>
                                          <span className='text-gray-400 dark:text-gray-400 mt-1 -mb-1'>{formatTime(currentFile.createdAt)}</span>
                                    </div>
                                    <Avatar
                                          src={currentFile.sender.profileImg}
                                          alt={`Profile picture of ${currentFile.sender.username}`}
                                          extraClassName='!w-12 !h-12 rounded-full ml-3'
                                          title={`Profile picture of ${currentFile.sender.username}`}
                                    />
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
                                          name={currentFile.fileName || 'file'}
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

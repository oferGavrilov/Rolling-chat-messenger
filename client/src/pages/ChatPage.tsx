import { useEffect, useState } from 'react'

import Navigation from '../components/Navigation'
import DynamicSideModal from '../components/side-modal/DynamicSideModal'
import DynamicList from '../components/dynamic-list/DynamicList'
import ChatInterface from '../components/selected-chat/ChatInterface'
import SelectedFile from '../components/SelectedFile'

import useStore  from '../context/store/useStore'
import { AuthState } from '../context/useAuth'
import { userService } from '../services/user.service'
import socketService from '../services/socket.service'
import SelectedImage from '../components/gallery-editor/selected-image'

export type ContentType = 'chats' | 'groups' | 'gallery' | 'videos' | 'story' | 'settings' | 'profile'

export default function ChatPage(): JSX.Element {
      const [showSearch, setShowSearch] = useState<boolean>(false)
      const [contentType, setContentType] = useState<ContentType>('chats')
      const [showNavigation, setShowNavigation] = useState<boolean>(true)
      const { selectedChat, selectedFile, selectedImage } = useStore()
      const { user } = AuthState()

      useEffect(() => {
            if (user) {
                  socketService.setup(user._id)
            }
      }, [])

      useEffect(() => {
            if (!user) return
            const theme = userService.getTheme()
            switch (theme) {
                  case 'dark':
                        document.body.style.backgroundColor = '#222e35'
                        document.body.classList.add('dark')
                        break;
                  case 'light':
                        document.body.style.backgroundColor = '#ffffff'
                        document.body.classList.remove('dark')
                        break;
            }

            return () => {
                  document.body.style.backgroundColor = '#ffffff'
                  document.body.classList.remove('dark')
            }
      }, [])

      if (!user) return <div></div>
      return (
            <div className='overflow-hidden flex h-[100svh] dark:bg-[#222e35]' data-testid="chat-page">
                  <div className='flex flex-1 slide-right md:overflow-hidden'>
                        <Navigation
                              contentType={contentType}
                              setContentType={setContentType}
                              showNavigation={showNavigation}
                              setShowNavigation={setShowNavigation}
                        />
                        <DynamicList
                              contentType={contentType}
                              setContentType={setContentType}
                              setShowSearch={setShowSearch}
                              showNavigation={showNavigation}
                              setShowNavigation={setShowNavigation}
                        />

                        {selectedChat && <ChatInterface />}
                        {selectedImage && <SelectedImage />}
                  </div>
                  {selectedFile && (
                        <SelectedFile />
                  )}

                  <DynamicSideModal
                        contentType={contentType}
                        isOpen={showSearch}
                        setIsOpen={setShowSearch}
                  />
            </div>
      );


}

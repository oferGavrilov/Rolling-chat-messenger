import { useEffect, useState } from 'react'

import Navigation from '../components/Navigation'
import SearchUsers from '../components/SideModal'
import DynamicList from '../components/ChatList/DynamicList'
import Messenger from '../components/selectedChat'
import SelectedFile from '../components/SelectedFile'

import { useChat } from '../store/useChat'
import { AuthState } from '../context/useAuth'

import socketService from '../services/socket.service'
import { userService } from '../services/user.service'

export type ContentType = 'chats' | 'videos' | 'story' | 'groups' | 'settings' | 'profile'

export default function ChatPage (): JSX.Element {
      const [showSearch, setShowSearch] = useState<boolean>(false)
      const [contentType, setContentType] = useState<ContentType>('chats')
      const [showNavigation, setShowNavigation] = useState<boolean>(true)
      const { selectedChat, selectedFile } = useChat()
      const { user } = AuthState()

      useEffect(() => {
            if (!user) return
            socketService.setup(user._id)
            socketService.login(user._id)

            return () => {
                  // socketService.off('login')
                  // socketService.emit(SOCKET_LOGOUT, user._id)
                  // socketService.terminate()
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
                  <div className='flex flex-1 slide-right md:overflow-hidden' >
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
                        {selectedChat && <Messenger />}
                  </div>
                  {selectedFile && (
                        <SelectedFile />
                  )}

                  <SearchUsers
                        contentType={contentType}
                        isOpen={showSearch}
                        setIsOpen={setShowSearch}
                  />

            </div>
      );


}

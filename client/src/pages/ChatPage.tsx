import Navigation from '../components/Navigation'
import SearchUsers from '../components/SideModal'
import { useEffect, useState } from 'react'
import DynamicList from '../components/ChatList/DynamicList'
import { useChat } from '../store/useChat'
import Messenger from '../components/selectedChat'
import { AuthState } from '../context/useAuth'
import socketService from '../services/socket.service'
import SelectedFile from '../components/SelectedFile'
import { userService } from '../services/user.service'

export default function ChatPage (): JSX.Element {
      const [showSearch, setShowSearch] = useState<boolean>(false)
      const [contentType, setContentType] = useState<string>('messages')
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
                        document.body.classList.add('dark')
                        break;
                  case 'light':
                        document.body.classList.remove('dark')
                        break;
            }
      }, [])

      if (!user) return <div></div>
      return (
            <div>
                  <div className='flex h-screen slide-right md:overflow-y-hidden dark:bg-dark-chat-bg' >
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
                        isAddNewGroup={true}
                        isOpen={showSearch}
                        setIsOpen={setShowSearch}
                  />

            </div>
      );


}

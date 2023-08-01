import Navigation from '../components/Navigation'
import SearchUsers from '../components/SideModal'
import { useEffect, useState } from 'react'
import DynamicList from '../components/ChatList/DynamicList'
import { useChat } from '../store/useChat'
import Messenger from '../components/selectedChat'
import { AuthState } from '../context/useAuth'
import socketService from '../services/socket.service'
import SelectedFile from '../components/SelectedFile'

export default function ChatPage (): JSX.Element {
      const [showSearch, setShowSearch] = useState<boolean>(false)
      const [contentType, setContentType] = useState<string>('messages')
      const [showNavigation, setShowNavigation] = useState<boolean>(true)
      const { selectedChat, selectedFile} = useChat()
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

      if (!user) return <div></div>
      return (
            <div>
                  <div className='flex h-screen slide-right overflow-y-hidden' >
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

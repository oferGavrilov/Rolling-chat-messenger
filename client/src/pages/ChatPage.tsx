import SideMenu from '../components/Navigation'
import SearchUsers from '../components/SideModal'
import { useState } from 'react'
import DynamicList from '../components/ChatList/DynamicList'
import { useChat } from '../store/useChat'
import Messenger from '../components/messenger'
import { AuthState } from '../context/useAuth'

export default function ChatPage (): JSX.Element {
      const [showSearch, setShowSearch] = useState<boolean>(false)
      const [contentType, setContentType] = useState<string>('messages')
      const { selectedChat } = useChat()
      const {user} = AuthState()

      if (!user) return <div></div>
      return (
            <div>
                  <div className='flex h-screen slide-right overflow-y-hidden'>
                        <SideMenu contentType={contentType} setContentType={setContentType} />
                        <DynamicList contentType={contentType} setShowSearch={setShowSearch} />
                        {selectedChat && <Messenger setShowSearch={setShowSearch} />}
                  </div>
                  <SearchUsers contentType={contentType} isOpen={showSearch} setIsOpen={setShowSearch} />
            </div>
      )
}

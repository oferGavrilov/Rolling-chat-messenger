import SideMenu from '../components/Navigation'
import SearchUsers from '../components/SideModal'
import { useState } from 'react'
import DynamicList from '../components/ChatList/DynamicList'
import { useChat } from '../store/useChat'
import Messenger from '../components/messenger'

export default function ChatPage (): JSX.Element {
      const [showSearch, setShowSearch] = useState<boolean>(false)
      const [contentType, setContentType] = useState<string>('messages')
      const { selectedChat } = useChat()

      return (
            <div>
                  <div className='flex h-screen slide-right'>
                        <SideMenu contentType={contentType} setContentType={setContentType} />
                        <DynamicList contentType={contentType} setShowSearch={setShowSearch} />
                        {selectedChat && <Messenger setShowSearch={setShowSearch} />}
                  </div>
                  <SearchUsers contentType={contentType} isOpen={showSearch} setIsOpen={setShowSearch} />
            </div>
      )
}

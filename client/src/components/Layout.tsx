import { Outlet } from 'react-router-dom'
import SideMenu from './Navigation'
import SearchUsers from './SideModal'
import { useState } from 'react'
import DynamicList from './ChatList/DynamicList'
import { useChat } from '../store/useChat'
import Messenger from './messenger'

export default function Layout () {
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
                  <Outlet />
                  <SearchUsers contentType={contentType} isOpen={showSearch} setIsOpen={setShowSearch} />
            </div>
      )
}

import { Outlet } from 'react-router-dom'
import SideMenu from './SideMenu'
import SearchUsers from './SearchUsers'
import { useState } from 'react'
import DynamicList from './DynamicList'
import Messenger from './Messenger'
import { ChatState } from '../context/ChatProvider'

export default function Layout () {
      const [showSearch, setShowSearch] = useState<boolean>(false)
      const [contentType, setContentType] = useState<string>('messages')
      const { selectedChat } = ChatState()

      return (
            <div>
                  <div className='flex h-screen  slide-right'>
                        <SideMenu contentType={contentType} setContentType={setContentType} />
                        <DynamicList contentType={contentType} setShowSearch={setShowSearch} />
                        {selectedChat && <Messenger />}
                  </div>
                  <Outlet />
                  <SearchUsers isOpen={showSearch} setIsOpen={setShowSearch} />
            </div>
      )
}

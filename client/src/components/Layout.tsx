import { Outlet } from 'react-router-dom'
import SideMenu from './SideMenu'
import ContentList from './ContentList'
import SearchUsers from './SearchUsers'
import { useState } from 'react'

export default function Layout () {
      const [showSearch, setShowSearch] = useState(false)

      return (
            <div>
                  <div className='flex h-screen'>
                        <SideMenu />
                        <ContentList setShowSearch={setShowSearch}/>
                  </div>
                  <Outlet />
                  <SearchUsers isOpen={showSearch} setIsOpen={setShowSearch} />
            </div>
      )
}

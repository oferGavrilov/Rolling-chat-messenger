import React, { useCallback, useEffect, useRef } from "react"
import { Link } from 'react-router-dom'
import { AuthState } from "../context/useAuth"
import useChat from '../store/useChat'

import Logo from "../assets/icons/Logo"
import Story from "../assets/icons/Story"
import socketService, { SOCKET_LOGOUT } from '../services/socket.service'

import { Avatar, Tooltip } from "@mui/material"
import { BsCameraVideo, BsChatText } from 'react-icons/bs'
import { FiSettings } from 'react-icons/fi'
import { RxExit } from 'react-icons/rx'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import { useClickOutside } from "../custom/useClickOutside"
import { ContentType } from "../pages/ChatPage"
interface Props {
      contentType: ContentType
      setContentType: React.Dispatch<React.SetStateAction<ContentType>>
      showNavigation: boolean
      setShowNavigation: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Navigation ({
      contentType,
      setContentType,
      showNavigation,
      setShowNavigation
}: Props): JSX.Element {
      const { user, logout } = AuthState()
      const { setSelectedChat } = useChat()
      const navigationRef = useRef<HTMLElement>(null)
      const enableClickOutside = window.innerWidth < 768

      useClickOutside(navigationRef, () => setShowNavigation(false), enableClickOutside && showNavigation)

      useEffect(() => {
            const handleResize = () => {
                  if (window.innerWidth < 768) {
                        setShowNavigation(false)
                  } else {
                        setShowNavigation(true)
                  }
            }

            window.addEventListener('resize', handleResize)
            handleResize()

            return () => window.removeEventListener('resize', handleResize)
      }, [setShowNavigation])

      function onSelectContentType(contentType: ContentType) {
            if (window.innerWidth < 768) {
                  setShowNavigation(false)
            }
            setContentType(contentType)
      }

      const handleLogout = useCallback(() => {
            socketService.emit(SOCKET_LOGOUT, user?._id)
            setSelectedChat(null)
            logout()
      }, [user, logout, setSelectedChat])

      return (
            <section ref={navigationRef} className={`navigation-container ${showNavigation ? 'w-[70px] opacity-100' : 'opacity-0 w-0 -translate-x-20 pointer-events-none'}`}>
                  <div className='flex flex-col items-center gap-y-5 border-b border-gray-300 py-5 mx-3'>
                        <Tooltip title="Home" arrow placement='right'>
                              <Link to='/'>
                                    <Logo />
                              </Link>
                        </Tooltip>
                        <Tooltip title="Profile" arrow placement='right'>
                              <Avatar src={user?.profileImg} sx={{ width: 45, height: 45 }} className="hover:scale-110 transition-all duration-300 cursor-pointer" onClick={() => setContentType('profile')} />
                        </Tooltip>
                  </div>
                  <div className="flex flex-col justify-between h-full">
                        <div className="flex flex-col gap-y-4">
                              <Tooltip title="Messages" arrow placement='right'>
                                    <div className={`navigation-icon ${contentType === 'chats' && 'active-navigation-icon'}`} onClick={() => onSelectContentType('chats')}>
                                          <BsChatText size={20} />
                                    </div>
                              </Tooltip>
                              <Tooltip title="Videos" arrow placement='right'>
                                    <div className={`navigation-icon ${contentType === 'videos' && 'active-navigation-icon'}`} onClick={() => onSelectContentType('videos')}>
                                          <BsCameraVideo size={20} />
                                    </div>
                              </Tooltip>
                              <Tooltip title="Stories" arrow placement='right'>
                                    <div className={`navigation-icon  ${contentType === 'story' && 'active-navigation-icon'}`} onClick={() => onSelectContentType('story')}>
                                          <Story />
                                    </div>
                              </Tooltip>
                              <Tooltip title="Groups" arrow placement='right'>
                                    <div className={`navigation-icon ${contentType === 'groups' && 'active-navigation-icon'}`} onClick={() => onSelectContentType('groups')}>
                                          <PeopleOutlinedIcon />
                                    </div>
                              </Tooltip>
                        </div>
                        <div className="flex flex-col ">
                              <Tooltip title="Settings" arrow placement='right'>
                                    <div className={`navigation-icon ${contentType === 'settings' && 'active-navigation-icon'}`} onClick={() => onSelectContentType('settings')}>
                                          <FiSettings className="text-2xl" />
                                    </div>
                              </Tooltip>
                              <Tooltip title="Logout" arrow placement='right'>
                                    <div className="navigation-icon mb-5 mt-3" onClick={handleLogout}>
                                          <RxExit className="rotate-180 text-2xl" />
                                    </div>
                              </Tooltip>
                        </div>
                  </div>
            </section >
      )
}

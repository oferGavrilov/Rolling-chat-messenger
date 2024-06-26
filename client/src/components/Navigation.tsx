import React, { useEffect, useRef } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { AuthState } from "../context/useAuth"
import useStore from '../context/store/useStore'

import Logo from "./svg/Logo"
// import Story from "./svg/Story"
import socketService from '../services/socket.service'
import { SocketEmitEvents } from "../utils/socketEvents"


import { Tooltip } from "@mui/material"
import { BsChatText } from 'react-icons/bs'
import { FiSettings } from 'react-icons/fi'
import { RxExit } from 'react-icons/rx'
import { useClickOutside } from "../custom-hook/useClickOutside"
import { ContentType } from "../pages/ChatPage"
import ProfileImage from "./common/ProfileImage"
import { userService } from "../services/user.service"

interface Props {
      contentType: ContentType
      setContentType: React.Dispatch<React.SetStateAction<ContentType>>
      showNavigation: boolean
      setShowNavigation: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Navigation({
      contentType,
      setContentType,
      showNavigation,
      setShowNavigation
}: Props): JSX.Element {
      const { user, setUser, setJustLoggedIn } = AuthState()
      const { setSelectedChat, setSelectedImage } = useStore()
      const navigate = useNavigate()
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
            setSelectedImage(null)
            if (window.innerWidth < 768) {
                  setShowNavigation(false)
            }
            setContentType(contentType)
      }

      async function handleLogout() {
            await userService.logout()
            setUser(null)
            navigate('/', { replace: true })
            socketService.emit(SocketEmitEvents.LOGOUT, user?._id)
            socketService.terminate()
            setSelectedChat(null)
            setJustLoggedIn(false)
      }

      if (!user) return <div></div>
      return (
            <section ref={navigationRef} className={`navigation-container ${showNavigation ? 'w-[70px] opacity-100' : 'opacity-0 w-0 -translate-x-20 pointer-events-none'}`}>
                  <div className='flex flex-col items-center gap-y-5 border-b border-gray-300 py-5 mx-3'>
                        <Tooltip title="Home" arrow placement='right'>
                              <Link to='/'>
                                    <Logo />
                              </Link>
                        </Tooltip>
                        <ProfileImage
                              className={`w-11 h-11 default-profile-img hover:scale-105 hover:shadow-lg shadow-gray-30 dark:shadow-gray-900 ${contentType === 'profile' ? 'outline-2 outline-double outline-primary' : ''}`}
                              src={user.profileImg}
                              TN_src={user.TN_profileImg}
                              alt={user.username}
                              onClick={() => setContentType('profile')}
                        />
                  </div>
                  <div className="flex flex-col justify-between h-full">
                        <div className="flex flex-col gap-y-4">
                              <Tooltip title="Messages" arrow placement='right'>
                                    <div className={`navigation-icon ${contentType === 'chats' ? 'active-navigation-icon' : ''}`} onClick={() => onSelectContentType('chats')}>
                                          <BsChatText size={20} />
                                    </div>
                              </Tooltip>
                              <Tooltip title="Groups" arrow placement='right'>
                                    <div className={`navigation-icon ${contentType === 'groups' ? 'active-navigation-icon' : ''}`} onClick={() => onSelectContentType('groups')}>
                                          <span className="material-symbols-outlined">group</span>
                                    </div>
                              </Tooltip>
                              {/* <Tooltip title="Gallery" arrow placement='right'>
                                    <div className={`navigation-icon ${contentType === 'gallery' && 'active-navigation-icon'}`} onClick={() => onSelectContentType('gallery')}>
                                          <span className="material-symbols-outlined">crop</span>
                                    </div>
                              </Tooltip>
                              <Tooltip title="Stories" arrow placement='right'>
                                    <div className={`navigation-icon  ${contentType === 'story' ? 'active-navigation-icon' : ''}`} onClick={() => onSelectContentType('story')}>
                                          <Story />
                                    </div>
                              </Tooltip> */}
                              {/* <Tooltip title="Videos" arrow placement='right'>
                                    <div className={`navigation-icon ${contentType === 'videos' ? 'active-navigation-icon' : ''}`} onClick={() => onSelectContentType('videos')}>
                                          <BsCameraVideo size={20} />
                                    </div>
                              </Tooltip> */}
                        </div>
                        <div className="flex flex-col ">
                              <Tooltip title="Settings" arrow placement='right'>
                                    <div className={`navigation-icon ${contentType === 'settings' ? 'active-navigation-icon' : ''}`} onClick={() => onSelectContentType('settings')}>
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

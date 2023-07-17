import { BsCameraVideo, BsChatText } from 'react-icons/bs'
import { FiSettings } from 'react-icons/fi'
import { RxExit } from 'react-icons/rx'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import Logo from "../assets/icons/Logo"
import Story from "../assets/icons/Story"
import { AuthState } from "../context/useAuth"
import { Avatar, Tooltip } from "@mui/material"
import { useEffect } from "react"
import { Socket, io } from 'socket.io-client'
interface Props {
      contentType: string
      setContentType: React.Dispatch<React.SetStateAction<string>>
      showNavigation: boolean
      setShowNavigation: React.Dispatch<React.SetStateAction<boolean>>
}

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://rolling-948m.onrender.com/' : 'http://localhost:5000'

let socket: Socket

export default function Navigation ({ contentType, setContentType, showNavigation, setShowNavigation }: Props) {

      const { user, logout } = AuthState()

      useEffect(() => {
            const handleResize = () => {
                  if (window.innerWidth > 768) {
                        setShowNavigation(true)
                  } else {
                        setShowNavigation(false)
                  }
            }

            window.addEventListener('resize', handleResize)

            handleResize()

            return () => window.removeEventListener('resize', handleResize)
      }, [])

      function onLogout () {
            socket = io(ENDPOINT, { transports: ['websocket'] })
            socket.emit('logout', user?._id)
            logout()
      }

      return (
            <section className={`${showNavigation ? 'w-[70px] opacity-100' : 'opacity-0 w-0 pointer-events-none'} transition-all max-w-[70px] duration-300 flex justify-between flex-col bg-[#FAFAFA] gap-y-4 h-full sticky z-10`}>
                  <div className='flex flex-col border-b border-gray-300 items-center py-7 gap-y-5 mx-3'>
                        <Logo />
                        <Tooltip title="Profile" arrow>
                              <Avatar src={user?.profileImg} sx={{ width: 45, height: 45 }} className="hover:scale-110 transition-all duration-300 cursor-pointer" onClick={() => setContentType('profile')} />
                        </Tooltip>
                  </div>
                  <div className="flex flex-col justify-between h-full">
                        <div className="flex flex-col gap-y-4">
                              <div className={`side-icon ${contentType === 'messages' && 'active-side-icon'}`} onClick={() => setContentType('messages')}>
                                    <BsChatText size={20} />
                              </div>
                              <div className={`side-icon ${contentType === 'videos' && 'active-side-icon'}`} onClick={() => setContentType('videos')}>
                                    <BsCameraVideo size={20} />
                              </div>
                              <div className={`side-icon  ${contentType === 'story' && 'active-side-icon'}`} onClick={() => setContentType('story')}>
                                    <Story />
                              </div>
                              <div className={`side-icon ${contentType === 'groups' && 'active-side-icon'}`} onClick={() => setContentType('groups')}>
                                    <PeopleOutlinedIcon />
                              </div>
                        </div>
                        <div className="flex flex-col ">
                              <div className="flex justify-center text-[#00000065] cursor-pointer hover:text-primary" onClick={() => setContentType('settings')}>
                                    <FiSettings size={27} />
                              </div>
                              <div className="flex justify-center text-[#00000065] cursor-pointer hover:text-primary py-7" onClick={onLogout}>
                                    <RxExit size={27} className="rotate-180" />
                              </div>
                        </div>
                  </div>
            </section >
      )
}

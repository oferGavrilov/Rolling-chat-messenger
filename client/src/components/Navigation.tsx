import { BsCameraVideo, BsChatText } from 'react-icons/bs'
import { FiSettings } from 'react-icons/fi'
import { RxExit } from 'react-icons/rx'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import Logo from "../assets/icons/Logo"
import Story from "../assets/icons/Story"
import { AuthState } from "../context/useAuth"
import { Avatar, Tooltip } from "@mui/material"
import { useCallback, useEffect } from "react"
import { Link } from 'react-router-dom'
import useChat from '../store/useChat'
import socketService, { SOCKET_LOGOUT } from '../services/socket.service'
interface Props {
      contentType: string
      setContentType: React.Dispatch<React.SetStateAction<string>>
      showNavigation: boolean
      setShowNavigation: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Navigation ({ contentType, setContentType, showNavigation, setShowNavigation }: Props): JSX.Element {
      const { user, logout } = AuthState()
      const { setSelectedChat } = useChat()

      const handleLogout = useCallback(() => {
            socketService.emit(SOCKET_LOGOUT, user?._id);
            setSelectedChat(null);
            logout();
      }, [user, logout, setSelectedChat]);

      useEffect(() => {
            socketService.setup();

            return () => {
                  socketService.terminate();
            };
      }, []);

      useEffect(() => {
            const handleResize = () => {
                  setShowNavigation(window.innerWidth > 768);
            };

            window.addEventListener('resize', handleResize);
            handleResize();

            return () => window.removeEventListener('resize', handleResize);
      }, [setShowNavigation]);

      return (
            <section className={`${showNavigation ? 'w-[70px] opacity-100' : 'opacity-0 w-0 pointer-events-none'} transition-all max-w-[70px] duration-300 flex justify-between flex-col bg-[#FAFAFA] gap-y-4 h-full sticky z-10`}>
                  <div className='flex flex-col border-b border-gray-300 items-center py-7 gap-y-5 mx-3'>
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
                                    <div className={`side-icon ${contentType === 'messages' && 'active-side-icon'}`} onClick={() => setContentType('messages')}>
                                          <BsChatText size={20} />
                                    </div>
                              </Tooltip>
                              <Tooltip title="Videos" arrow placement='right'>
                                    <div className={`side-icon ${contentType === 'videos' && 'active-side-icon'}`} onClick={() => setContentType('videos')}>
                                          <BsCameraVideo size={20} />
                                    </div>
                              </Tooltip>
                              <Tooltip title="Stories" arrow placement='right'>
                                    <div className={`side-icon  ${contentType === 'story' && 'active-side-icon'}`} onClick={() => setContentType('story')}>
                                          <Story />
                                    </div>
                              </Tooltip>
                              <Tooltip title="Groups" arrow placement='right'>
                                    <div className={`side-icon ${contentType === 'groups' && 'active-side-icon'}`} onClick={() => setContentType('groups')}>
                                          <PeopleOutlinedIcon />
                                    </div>
                              </Tooltip>
                        </div>
                        <div className="flex flex-col ">
                              <div className="flex justify-center text-[#00000065] cursor-pointer hover:text-primary" onClick={() => setContentType('settings')}>
                                    <FiSettings size={27} />
                              </div>
                              <div className="flex justify-center text-[#00000065] cursor-pointer hover:text-primary py-7" onClick={handleLogout}>
                                    <RxExit size={27} className="rotate-180" />
                              </div>
                        </div>
                  </div>
            </section >
      )
}

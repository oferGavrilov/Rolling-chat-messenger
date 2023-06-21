import { AuthState } from "../context/useAuth"
import { BsCameraVideo, BsChatText } from 'react-icons/bs'
import { FiSettings } from 'react-icons/fi'
import { RxExit } from 'react-icons/rx'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import Logo from "../assets/icons/Logo"
import Story from "../assets/icons/Story"

interface Props {
      contentType: string
      setContentType: React.Dispatch<React.SetStateAction<string>>
}

export default function SideMenu ({ contentType, setContentType }: Props) {
      const { user, logout } = AuthState()

      return (
            <section className="w-[70px] flex flex-col bg-[#FAFAFA] gap-y-4 h-full sticky z-10">
                  <div className='flex flex-col border-b border-gray-300 items-center py-7 gap-y-5 mx-3'>
                        <Logo />
                        <img src={user?.profileImg} className="w-11 h-11 rounded-full" alt="profile" />
                  </div>
                  <div className="flex flex-col justify-between h-full">
                        <div className="flex flex-col gap-y-4">
                              <div className={`side-icon ${contentType === 'messages' && 'active-side-icon'}`} onClick={() => setContentType('messages')}>
                                    <BsChatText size={20} />
                              </div>
                              <div className={`side-icon ${contentType === 'video-chat' && 'active-side-icon'}`} onClick={() => setContentType('video-chat')}>
                                    <BsCameraVideo size={20} />
                              </div>
                              <div className={`side-icon  ${contentType === 'story' && 'active-side-icon'}`} onClick={() => setContentType('story')}>
                                    <Story />
                              </div>
                              <div className={`side-icon ${contentType === 'communities' && 'active-side-icon'}`} onClick={() => setContentType('communities')}>
                                    <PeopleOutlinedIcon />
                              </div>
                        </div>
                        <div className="flex flex-col ">
                              <div className="flex justify-center text-[#00000065] cursor-pointer hover:text-primary">
                                    <FiSettings size={27} />
                              </div>
                              <div className="flex justify-center text-[#00000065] cursor-pointer hover:text-primary py-7" onClick={logout}>
                                    <RxExit size={27} className="rotate-180" />
                              </div>
                        </div>
                  </div>
            </section >
      )
}


import { ChatState } from "../context/ChatProvider"
import { BsCameraVideo, BsChatText } from 'react-icons/bs'
import { TfiWorld } from 'react-icons/tfi'
import { BiUser } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'
import { RxExit } from 'react-icons/rx'
import Logo from "../assets/icons/Logo"

export default function SideMenu () {

      const { user } = ChatState()
      console.log(user)
      const active = false
      return (
            <section className="w-[70px] flex flex-col bg-[#FAFAFA] gap-y-4 h-full">
                  <div className='flex flex-col border-b border-gray-300 items-center py-7 gap-y-5 mx-3'>
                        <Logo />
                        <img src={user?.profileImg} className="w-11 h-11 rounded-full" alt="profile" />
                  </div>
                  <div className="flex flex-col justify-between h-full">
                        <div className="flex flex-col gap-y-4">
                              <div className={`side-icon  ${active && 'active-side-icon'}`}>
                                    <TfiWorld size={20} />
                              </div>
                              <div className={`side-icon ${active && 'active-side-icon'}`}>
                                    <BsChatText size={20} />
                              </div>
                              <div className={`side-icon ${active && 'active-side-icon'}`}>
                                    <BsCameraVideo size={20} />
                              </div>
                              <div className={`side-icon ${active && 'active-side-icon'}`}>
                                    <BiUser size={20} />
                              </div>
                        </div>
                        <div className="flex flex-col ">
                              <div className="flex justify-center text-[#00000065] cursor-pointer hover:text-primary">
                                    <FiSettings size={27} />
                              </div>
                              <div className="flex justify-center text-[#00000065] cursor-pointer hover:text-primary py-7">
                                    <RxExit size={27} className="rotate-180" />
                              </div>
                        </div>
                  </div>
            </section >
      )
}


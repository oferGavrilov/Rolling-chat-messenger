import React, { useState } from 'react'
import { AuthState } from '../context/useAuth'
import FormatColorFillOutlinedIcon from '@mui/icons-material/FormatColorFillOutlined'
import WallpaperOutlinedIcon from '@mui/icons-material/WallpaperOutlined'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import CloseIcon from '@mui/icons-material/Close';
import { userService } from '../services/user.service';

import images from '../constants/chat-colors.json'
interface SettingsProps {
      setContentType: React.Dispatch<React.SetStateAction<string>>
}

export default function Settings ({ setContentType }: SettingsProps) {
      const [isChooseBackground, setIsChooseBackground] = useState(false)
      
      const { user , chatBackground , setChatBackground } = AuthState()

      function onSetBackgroundColor(color: string) {
            userService.saveUserBackgroundImage(color)
            setChatBackground(color)
      }

      return (
            <section className=''>
                  <div className='p-4 flex hover:bg-gray-100 cursor-pointer'>
                        <img src={user.profileImg} alt="profile" className='h-20 w-20 rounded-full object-cover object-top' />
                        <div className='flex flex-col justify-center ml-4'>
                              <span className='text-2xl'>{user.username}</span>
                              <span className='text-[#00000065] text-lg'>{user.about}</span>
                        </div>
                  </div>
                  <ul >
                        <li className='p-4 flex hover:bg-gray-100 cursor-pointer items-center'>
                              <FormatColorFillOutlinedIcon className='mr-4 text-[#00000085]' />
                              Theme
                        </li>
                        <li className='p-4 flex hover:bg-gray-100 cursor-pointer items-center' onClick={() => setIsChooseBackground(!isChooseBackground)}>
                              <WallpaperOutlinedIcon className='mr-4 text-[#00000085]' />
                              Chat background
                        </li>

                        <div className={`transition-all duration-300 ${isChooseBackground ? 'h-max' : 'h-0 opacity-0 pointer-events-none'}`} >
                              <div className='p-4 bg-quinary relative'>
                                    <h2 className='mb-4'>Choose Background: </h2>
                                    <ul className='flex flex-wrap gap-4'>
                                          {images.map((color, i) => (
                                                <li key={i} className='choose-bg shadow-md shadow-gray-400 relative transition-transform duration-300 hover:scale-105' style={{background: color}} onClick={() => onSetBackgroundColor(color)}>
                                                      {chatBackground === color && <span className='absolute bg-primary text-xs rounded-md p-[2px] bottom-0 right-0 text-white'>Active</span>}
                                                </li>
                                          ))}
                                    </ul>
                                    <CloseIcon className='absolute top-3 right-3 cursor-pointer' onClick={() => setIsChooseBackground(false)} />
                              </div>
                        </div>


                        <li className='p-4 flex hover:bg-gray-100 cursor-pointer items-center' onClick={() => setContentType('messages')}>
                              <KeyboardArrowLeftIcon fontSize='small' className='mr-1 text-[#00000085]' />
                              Back
                        </li>
                  </ul>

            </section >
      )
}

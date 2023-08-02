import React,{ useState } from 'react'
import { AuthState } from '../../context/useAuth'
import FormatColorFillOutlinedIcon from '@mui/icons-material/FormatColorFillOutlined'
import WallpaperOutlinedIcon from '@mui/icons-material/WallpaperOutlined'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import ChatColorsPalette from './ChatColorsPalette';
interface SettingsProps {
      setContentType: React.Dispatch<React.SetStateAction<string>>
}

export default function Settings ({ setContentType }: SettingsProps) : JSX.Element{
      const [isChooseColor, setIsChooseColor] = useState(false)

      const { user } = AuthState()



      return (
            <section className=''>
                  <div className='p-4 flex hover:bg-gray-100 cursor-pointer'>
                        <img src={user?.profileImg} alt="profile" className='h-20 w-20 rounded-full object-cover object-top' />
                        <div className='flex flex-col justify-center ml-4'>
                              <span className='text-2xl'>{user?.username}</span>
                              <span className='text-[#00000065] text-lg'>{user?.about}</span>
                        </div>
                  </div>
                  <ul >
                        <li className='p-4 flex hover:bg-gray-100 cursor-pointer items-center'>
                              <FormatColorFillOutlinedIcon className='mr-4 text-[#00000085]' />
                              Theme
                        </li>
                        <li className='p-4 flex hover:bg-gray-100 cursor-pointer items-center' onClick={() => setIsChooseColor(!isChooseColor)}>
                              <WallpaperOutlinedIcon className='mr-4 text-[#00000085]' />
                              Chat background
                        </li>

                        <ChatColorsPalette isChooseColor={isChooseColor} setIsChooseColor={setIsChooseColor} />


                        <li className='p-4 flex hover:bg-gray-100 cursor-pointer items-center' onClick={() => setContentType('messages')}>
                              <KeyboardArrowLeftIcon fontSize='small' className='mr-1 text-[#00000085]' />
                              Back
                        </li>
                  </ul>

            </section >
      )
}

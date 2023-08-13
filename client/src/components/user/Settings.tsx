import React, { useState } from 'react'
import { AuthState } from '../../context/useAuth'


import ChatColorsPalette from './ChatColorsPalette'
import ThemeSelector from './ThemeSelector'

import FormatColorFillOutlinedIcon from '@mui/icons-material/FormatColorFillOutlined'
import WallpaperOutlinedIcon from '@mui/icons-material/WallpaperOutlined'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

interface SettingsProps {
      setContentType: React.Dispatch<React.SetStateAction<string>>
}

export default function Settings ({ setContentType }: SettingsProps): JSX.Element {
      const [selectedSettings, setSelectedSettings] = useState<'theme' | 'background' | null>(null);
      const { user } = AuthState()

      function onSelectSettings (settings: string) {
            if (selectedSettings === settings) setSelectedSettings(null)
            else setSelectedSettings(settings as 'theme' | 'background')
      }

      return (
            <section>
                  <div className='p-4 flex hover:bg-gray-100 dark:hover:bg-dark-secondary-bg cursor-pointer'>
                        <img src={user?.profileImg} alt="profile" className='h-20 w-20 rounded-full object-cover object-top' />
                        <div className='flex flex-col justify-center ml-4'>
                              <span className='text-2xl'>{user?.username}</span>
                              <span className='text-[#00000065] dark:text-gray-400 text-lg'>{user?.about}</span>
                        </div>
                  </div>
                  <ul>
                        <li className='p-4 flex hover:bg-gray-100 dark:hover:bg-dark-secondary-bg cursor-pointer items-center' onClick={() => onSelectSettings('theme')}>
                              <FormatColorFillOutlinedIcon className='mr-4 text-inherit' />
                              Theme
                        </li>

                        <ThemeSelector settings={selectedSettings} />

                        <li className='p-4 mt-1 flex hover:bg-gray-100 dark:hover:bg-dark-secondary-bg cursor-pointer items-center' onClick={() => onSelectSettings('background')}>
                              <WallpaperOutlinedIcon className='mr-4 text-inherit' />
                              Chat background
                        </li>

                        <ChatColorsPalette selectedSettings={selectedSettings} setSelectedSettings={setSelectedSettings} />

                        <li className='p-4 flex hover:bg-gray-100 dark:hover:bg-dark-secondary-bg cursor-pointer items-center' onClick={() => setContentType('messages')}>
                              <KeyboardArrowLeftIcon fontSize='small' className='mr-1 text-inherit' />
                              Back
                        </li>
                  </ul>
            </section >
      )
}

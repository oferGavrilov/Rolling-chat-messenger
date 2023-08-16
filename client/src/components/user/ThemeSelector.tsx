import { userService } from '../../services/user.service';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';
import { useState } from 'react';


interface Props {
      settings: 'theme' | 'background' | null,
}

export default function ThemeSelector ({ settings }: Props): JSX.Element {
      const [theme, setTheme] = useState<'light' | 'dark' | 'black'>(userService.getTheme() || 'light')


      function onSelectTheme (theme: "light" | "dark" | "black") {
            userService.saveTheme(theme)
            setTheme(theme)

            if (theme === 'light') document.body.classList.remove('dark')
            else document.body.classList.add('dark')
      }

      return (
            <div className={`bg-gray-100 dark:bg-dark-secondary-bg relative overflow-hidden transition-all duration-300 ease-in-out p-2 md:p-4 rounded-b-lg
                    ${settings === 'theme' ? 'max-h-[400px]' : 'max-h-0  !py-0 '}`}>

                  <div className='flex rounded-full justify-center bg-gray-400 w-max mx-auto text-white'>
                        <div className={`theme-options rounded-l-full ${theme === 'light' && 'bg-primary'}`} onClick={() => onSelectTheme('light')}>
                              <LightModeIcon className=' text-gray-100' />
                              Light
                        </div>
                        <div className={`theme-options ${theme === 'dark' && 'bg-primary dark:bg-dark-tertiary-bg'}`} onClick={() => onSelectTheme('dark')}>
                              <NightsStayOutlinedIcon className=' text-gray-100' />
                              Dark
                        </div>
                        <div className={`theme-options rounded-r-full ${theme === 'black' && 'bg-primary'}`} onClick={() => onSelectTheme('black')}>
                              <DarkModeIcon className='text-gray-100' />
                              Black
                        </div>
                  </div>

            </div>
      )
}

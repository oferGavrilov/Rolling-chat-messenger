import { useState } from 'react'

import { userService } from '../../../services/user.service'

import LightModeIcon from '@mui/icons-material/LightMode'
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined'

interface Props {
      settings: 'theme' | 'background' | null,
}

export default function ThemeSelector ({ settings }: Props): JSX.Element {
      const [theme, setTheme] = useState<'light' | 'dark'>(userService.getTheme() || 'light')


      function onSelectTheme (theme: "light" | "dark") {
            userService.saveTheme(theme)
            setTheme(theme)

            if (theme === 'light') {
                  document.body.classList.remove('dark')
                  document.body.style.backgroundColor = '#ffffff'
            } else{
                  document.body.classList.add('dark')
                  document.body.style.backgroundColor = '#222e35'
            } 
      }

      return (
            <div className={`bg-gray-100 dark:bg-dark-secondary-bg relative overflow-hidden transition-all duration-300 ease-in-out p-2 md:p-4 rounded-b-lg
                    ${settings === 'theme' ? 'max-h-[400px]' : 'max-h-0  !py-0 '}`}>

                  <div className='flex rounded-full justify-center bg-gray-400 w-max mx-auto text-white'>
                        <div className={`theme-options rounded-l-full ${theme === 'light' && 'bg-primary'}`} onClick={() => onSelectTheme('light')}>
                              <LightModeIcon className=' text-gray-100' />
                              Light
                        </div>
                        <div className={`theme-options rounded-r-full ${theme === 'dark' && 'bg-primary'}`} onClick={() => onSelectTheme('dark')}>
                              <NightsStayOutlinedIcon className=' text-gray-100' />
                              Dark
                        </div>
                  </div>
            </div>
      )
}

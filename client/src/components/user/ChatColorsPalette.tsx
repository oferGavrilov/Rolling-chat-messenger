import { AuthState } from '../../context/useAuth'
import { userService } from '../../services/user.service'
import CloseIcon from '@mui/icons-material/Close'

import colors from '../../constants/chat-colors.json'


interface Props {
      selectedSettings: string | null
      setSelectedSettings: (value: 'theme' | 'background' | null) => void
}

export default function ChatColorsPalette ({ selectedSettings, setSelectedSettings }: Props) : JSX.Element {
      const { chatBackgroundColor, setChatBackgroundColor } = AuthState()


      function onSetBackgroundColor (color: string) {
            userService.saveUserBackgroundImage(color)
            setChatBackgroundColor(color)
      }

      return (
            <div className={`bg-gray-100 mb-1 dark:bg-dark-secondary-bg relative overflow-hidden transition-all duration-300 ease-in-out px-4 py-2 rounded-b-lg
              ${selectedSettings === 'background' ? 'max-h-[500px]' : 'max-h-0 !py-0 max-w-max'}`}>
                  <h2 className='mb-4'>Choose Background: </h2>
                  <ul className='flex flex-wrap justify-center md:grid grid-cols-3 md:grid-cols-3 justify-items-center px-4 gap-4 pt-4 pb-8 max-h-[420px] overflow-y-scroll'>
                        {colors.map((color, i) => (
                              <li
                                    key={i}
                                    className='choose-bg'
                                    style={{ background: color }}
                                    onClick={() => onSetBackgroundColor(color)}
                              >
                                    {chatBackgroundColor === color &&
                                          <span className='absolute bg-primary text-xs rounded-md p-[2px] bottom-0 right-0 text-white'>
                                                Active
                                          </span>
                                    }
                              </li>
                        ))}
                  </ul>
                  {selectedSettings === 'background' &&
                        <CloseIcon className='absolute top-3 right-3 cursor-pointer' onClick={() => setSelectedSettings(null)} />
                  }
            </div>
      )
}

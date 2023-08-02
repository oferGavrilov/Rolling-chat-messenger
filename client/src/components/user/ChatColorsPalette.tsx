import { AuthState } from '../../context/useAuth'
import CloseIcon from '@mui/icons-material/Close';
import { userService } from '../../services/user.service';

import colors from '../../constants/chat-colors.json'

interface Props {
      isChooseColor: boolean
      setIsChooseColor: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChatColorsPalette ({ isChooseColor, setIsChooseColor }: Props) {
      const { chatBackgroundColor, setChatBackgroundColor } = AuthState()


      function onSetBackgroundColor (color: string) {
            userService.saveUserBackgroundImage(color)
            setChatBackgroundColor(color)
      }
      return (
            <div className={`bg-quinary relative overflow-hidden transition-all duration-300 ease-in-out px-4 py-2 rounded-lg ${isChooseColor ? 'max-h-[500px]' : 'max-h-0 !px-0 !py-0 max-w-max'}`}>
                  <h2 className='mb-4'>Choose Background: </h2>
                  <ul className='flex flex-wrap gap-4 pt-1 pb-2 max-h-[420px] overflow-y-scroll'>
                        {colors.map((color, i) => (
                              <li key={i} className='choose-bg shadow-md shadow-gray-400 relative transition-transform duration-300 hover:scale-105' style={{ background: color }} onClick={() => onSetBackgroundColor(color)}>
                                    {chatBackgroundColor === color && <span className='absolute bg-primary text-xs rounded-md p-[2px] bottom-0 right-0 text-white'>Active</span>}
                              </li>
                        ))}
                  </ul>
                  {isChooseColor && <CloseIcon className='absolute top-3 right-3 cursor-pointer' onClick={() => setIsChooseColor(false)} />}
            </div>
      )
}

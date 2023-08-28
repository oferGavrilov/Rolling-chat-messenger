import Chats from "./chats/Chats"
import useChat from "../../store/useChat"
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import Settings from "./user/Settings"
import MenuIcon from '@mui/icons-material/Menu'
import Profile from "./user/Profile"
import { ContentType } from "../../pages/ChatPage"

function Story (): JSX.Element {
      return (
            <section className='pt-7 px-4 relative'>

                  Coming soon...
            </section>
      )
}

function Videos (): JSX.Element {
      return (
            <section className='pt-7 px-4 relative'>

                  Coming soon...
            </section>
      )
}


interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
      contentType: ContentType
      setContentType: React.Dispatch<React.SetStateAction<ContentType>>
      showNavigation: boolean
      setShowNavigation: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DynamicList (props: Props) {
      const { selectedChat, setSelectedChat } = useChat()

      function getContent (): JSX.Element {
            switch (props.contentType) {
                  case 'chats':
                        return <Chats contentType={props.contentType} />
                  case 'videos':
                        return <Videos />
                  case 'story':
                        return <Story />
                  case 'settings':
                        return <Settings setContentType={props.setContentType} />
                  case 'profile':
                        return <Profile />
                  case 'groups':
                        return <Chats contentType={props.contentType} />
                  default:
                        return <Chats contentType={props.contentType} />
            }
      }

      function getIcon (): JSX.Element {
            switch (props.contentType) {
                  case 'chats':
                        return <PersonAddIcon className="dark:text-dark-primary-text" />
                  case 'videos':
                        return <VideoCallIcon />
                  case 'story':
                        return <PersonAddIcon />
                  case 'settings':
                        return <div ></div>
                  case 'profile':
                        return <div className="pointer-events-none"></div>
                  case 'groups':
                        return <GroupAddOutlinedIcon className="dark:text-dark-primary-text" />
                  default:
                        return <PersonAddIcon />
            }
      }

      function onShowSearch () {
            props.setShowSearch(true)
            setSelectedChat(null)
      }

      return (
            <section className={`${selectedChat ? 'hidden md:block' : 'block'} 
            bg-white dark:bg-dark-primary-bg dark:text-dark-primary-text overflow-hidden
                  w-full md:w-[364px] border-r-2 border-[#EEEEEE] dark:border-none slide-right`}>

                  <div className='flex justify-between items-center md:pb-4 pt-3 md:pt-7 mx-4'>
                        <div className={`md:!hidden p-2 rounded-full cursor-pointer text-primary dark:text-dark-primary-text hover:bg-gray-200 dark:hover:bg-dark-default-hover-bg ${props.showNavigation && 'pointer-events-none'}`} onClick={() => props.setShowNavigation(!props.showNavigation)}>
                              <MenuIcon />
                        </div>
                        <h2 className="text-xl md:text-3xl font-sf-regular font-bold">{props.contentType.charAt(0).toUpperCase() + props.contentType.slice(1)}</h2>
                        <div onClick={onShowSearch} className='message-filter-icon'>
                              {getIcon()}
                        </div>
                  </div>

                  {getContent()}
            </section>
      )
}

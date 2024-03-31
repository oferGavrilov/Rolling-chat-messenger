import Chats from "./chats/Chats"
import useStore from "../../context/store/useStore"
import Settings from "./user/Settings"
import Profile from "./user/Profile"
import { ContentType } from "../../pages/ChatPage"
import Gallery from "./gallery/Gallery"
import Story from "./story/Story"

function Videos(): JSX.Element {
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

export default function DynamicList(props: Props) {
      const { selectedChat } = useStore()

      function getContent(): JSX.Element {
            switch (props.contentType) {
                  case 'chats':
                        return <Chats contentType={props.contentType} />
                  case 'groups':
                        return <Chats contentType={props.contentType} />
                  case 'gallery':
                        return <Gallery />
                  case 'videos':
                        return <Videos />
                  case 'story':
                        return <Story />
                  case 'settings':
                        return <Settings setContentType={props.setContentType} />
                  case 'profile':
                        return <Profile />
                  default:
                        return <Chats contentType={props.contentType} />
            }
      }

      function getSearchIcon(): JSX.Element {
            switch (props.contentType) {
                  case 'chats':
                        return (
                              <div onClick={onShowSearch} className='message-filter-icon'>
                                    <span className="material-symbols-outlined dark:text-dark-primary-text">person_add</span>
                              </div>
                        )
                  case 'groups':
                        return (
                              <div onClick={onShowSearch} className='message-filter-icon'>
                                    <span className="material-symbols-outlined dark:text-dark-primary-text">group_add</span>
                              </div>
                        )
                  case 'videos':
                  case 'story':
                  case 'settings':
                  case 'profile':
                  case 'gallery':
                        return <div></div>
                  default:
                        return (
                              <div onClick={onShowSearch} className='message-filter-icon'>
                                    <span className="material-symbols-outlined dark:text-dark-primary-text">person_add</span>
                              </div>
                        )
            }
      }

      function onShowSearch() {
            props.setShowSearch(true)
      }

      return (
            <section className={`${selectedChat ? 'hidden md:block' : 'block'} 
            bg-white dark:bg-dark-primary-bg dark:text-dark-primary-text overflow-hidden
                  w-full md:w-[364px] xl:w-[400px] 3xl:w-[540px] border-r-2 border-[#EEEEEE] dark:border-none slide-right`}>

                  <div className='flex justify-between items-center md:pb-4 pt-3 md:pt-7 mx-4'>
                        <div className={`md:!hidden flex items-center justify-center p-2 rounded-full leading-none cursor-pointer text-primary dark:text-dark-primary-text hover:bg-gray-200 dark:hover:bg-dark-default-hover-bg ${props.showNavigation ? 'pointer-events-none' : ''}`} onClick={() => props.setShowNavigation(!props.showNavigation)}>
                              <span className="material-symbols-outlined">menu</span>
                        </div>
                        <h2 className="text-xl md:text-3xl font-bold">{props.contentType.charAt(0).toUpperCase() + props.contentType.slice(1)}</h2>
                        {getSearchIcon()}
                  </div>

                  {getContent()}
            </section>
      )
}

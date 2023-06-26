import Messages from "./ChatList/messages/Messages"
import Videos from "./ChatList/videos/Videos"
import Story from "./ChatList/stories/Stories"
import Communities from "./ChatList/groups/Groups"
import useChat from "../store/useChat"
import PersonAddIcon from '@mui/icons-material/PersonAdd'

interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
      contentType: string
}

export default function DynamicList (props: Props) {

      const { selectedChat } = useChat()

      function getContent (): JSX.Element {
            switch (props.contentType) {
                  case 'messages':
                        return <Messages />
                  case 'videos':
                        return <Videos {...props} />
                  case 'story':
                        return <Story {...props} />
                  case 'groups':
                        return <Communities {...props} />
                  default:
                        return <Messages />
            }
      }


      return (
            <section className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-[364px] border-r-2 border-[#EEEEEE] `}>

                  <div className='flex justify-between items-center pb-4 pt-7 mx-4'>
                        <h2 className="text-2xl md:text-3xl font-sf-regular font-bold ">Messages</h2>
                        <div onClick={() => props.setShowSearch(true)} className='message-filter-icon'>
                              <PersonAddIcon />
                        </div>
                  </div>
                  {getContent()}
            </section>
      )
}

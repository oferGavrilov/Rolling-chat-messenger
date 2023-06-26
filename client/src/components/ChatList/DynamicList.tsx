import Messages from "./messages/Messages"
import Videos from "./videos/Videos"
import Story from "./stories/Stories"
import useChat from "../../store/useChat"
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import VideoCallIcon from '@mui/icons-material/VideoCall'

interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
      contentType: string
}

export default function DynamicList (props: Props) {

      const { selectedChat } = useChat()

      function getContent (): JSX.Element {
            switch (props.contentType) {
                  case 'messages':
                        return <Messages contentType={props.contentType} />
                  case 'videos':
                        return <Videos />
                  case 'story':
                        return <Story />
                  case 'groups':
                        return <Messages contentType={props.contentType}  />
                  default:
                        return <Messages  contentType={props.contentType}/>
            }
      }

      function getIcon(): JSX.Element {
            switch (props.contentType) {
                  case 'messages':
                        return <PersonAddIcon />
                  case 'videos':
                        return <VideoCallIcon />
                  case 'story':
                        return <PersonAddIcon />
                  case 'groups':
                        return <GroupAddOutlinedIcon />
                  default:
                        return <PersonAddIcon />
            }
      }


      return (
            <section className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-[364px] border-r-2 border-[#EEEEEE] `}>

                  <div className='flex justify-between items-center pb-4 pt-7 mx-4'>
                        <h2 className="text-2xl md:text-3xl font-sf-regular font-bold ">{props.contentType.charAt(0).toUpperCase() + props.contentType.slice(1)}</h2>
                        <div onClick={() => props.setShowSearch(true)} className='message-filter-icon'>
                              {getIcon()}
                        </div>
                  </div>
                  {getContent()}
            </section>
      )
}

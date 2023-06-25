import Messages from "./ChatList/messages/Messages"
import Videos from "./ChatList/videos/Videos"
import Story from "./ChatList/stories/Stories"
import Communities from "./ChatList/groups/Groups"
import useChat from "../store/useChat"

interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
      contentType: string
}

export default function DynamicList (props: Props) {

      const {selectedChat} = useChat()

      function getContent (): JSX.Element {
            switch (props.contentType) {
                  case 'messages':
                        return <Messages {...props} />
                  case 'videos':
                        return <Videos {...props} />
                  case 'story':
                        return <Story {...props} />
                  case 'groups':
                        return <Communities {...props} />
                  default:
                        return <Messages {...props} />
            }
      }


      return (
            <section className={`${selectedChat ? 'hidden' : 'block'} w-full md:w-[364px] border-r-2 border-[#EEEEEE] `}>
                  {getContent()}
            </section>
      )
}

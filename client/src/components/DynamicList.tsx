import Messages from "./ChatList/messages/Messages"
import Videos from "./ChatList/Videos"
import Story from "./ChatList/Story"
import Communities from "./ChatList/Communities"

interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
      contentType: string
}

export default function DynamicList (props: Props) {

      function getContent (): JSX.Element {
            switch (props.contentType) {
                  case 'messages':
                        return <Messages {...props} />
                  case 'video-chat':
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
            <section className="w-[364px]  border-r-2 border-[#EEEEEE] ">
                  {getContent()}
            </section>
      )
}

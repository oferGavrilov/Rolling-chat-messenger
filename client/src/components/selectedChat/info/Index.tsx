import useChat from "../../../store/useChat"
import { IUser } from "../../../model/user.model"

import CloseIcon from '@mui/icons-material/Close'

import ChatInfo from "./ChatInfo"
import GroupInfo from "./GroupInfo"
import { IMessage } from "../../../model/message.model"

interface Props {
      conversationUser: IUser | undefined
      setChatMode: React.Dispatch<React.SetStateAction<string>>
      messages: IMessage[]
}

export default function Info ({ conversationUser, setChatMode, messages }: Props): JSX.Element {
      const { selectedChat } = useChat()

      return (
            <div className="flex flex-col items-center py-8 relative slide-right overflow-y-auto hide-scrollbar h-[calc(100vh-64px)]">
                  {selectedChat?.isGroupChat ?
                        (<GroupInfo messages={messages} />) :
                        (<ChatInfo conversationUser={conversationUser} messages={messages} />)}
                  <CloseIcon className="absolute top-5 right-5 dark:text-dark-primary-text cursor-pointer !text-2xl md:!text-3xl" onClick={() => setChatMode('chat')} />
            </div>
      )
}

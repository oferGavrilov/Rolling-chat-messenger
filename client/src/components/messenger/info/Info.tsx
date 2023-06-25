import useChat from "../../../store/useChat"
import { User } from "../../../model/user.model"

import CloseIcon from '@mui/icons-material/Close'

import ChatInfo from "./ChatInfo"
import GroupInfo from "./GroupInfo"

interface Props {
      conversationUser: User
      setMode: CallableFunction
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Info ({ conversationUser, setMode }: Props) {
      const { selectedChat } = useChat()

      return (
            <div className="flex flex-col items-center py-2 relative slide-right overflow-y-auto hide-scrollbar">
                  {selectedChat.isGroupChat ?
                        (<GroupInfo />) :
                        (<ChatInfo conversationUser={conversationUser} />)}
                  <CloseIcon className="absolute top-0 right-5 cursor-pointer !text-2xl md:!text-3xl" onClick={() => setMode('chat')} />
            </div>
      )
}

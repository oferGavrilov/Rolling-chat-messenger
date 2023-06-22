import useChat from "../../../store/useChat"
import { User } from "../../../model/user.model"

import CloseIcon from '@mui/icons-material/Close'

import ChatInfo from "./ChatInfo"
import GroupInfo from "./GroupInfo"

export default function Info ({ conversationUser, setMode }: { conversationUser: User, setMode: CallableFunction }) {
      const { selectedChat } = useChat()

      return (
            <div className="flex flex-col items-center py-2 relative slide-right">
                  {selectedChat.isGroupChat ?
                        (<GroupInfo />) :
                        (<ChatInfo conversationUser={conversationUser} />)}
                  <CloseIcon className="absolute top-0 right-8 cursor-pointer !text-3xl" onClick={() => setMode('chat')} />
            </div>
      )
}

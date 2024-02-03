import React, { useState } from 'react'
import useStore from "../../../context/store/useStore"
import { IUser } from "../../../model/user.model"

import CloseIcon from '@mui/icons-material/Close'

import ChatInfo from "./ChatInfo"
import GroupInfo from "./GroupInfo"
import { IMessage } from "../../../model/message.model"

interface Props {
      conversationUser: IUser | null
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
      messages: IMessage[]
}

export default function Info ({ conversationUser, setChatMode, messages }: Props): JSX.Element {
      const { selectedChat } = useStore()
      const [isAddUsers, setIsAddUsers] = useState<boolean>(false)

      return (
            <div className={`flex flex-col items-center relative slide-right overflow-y-auto hide-scrollbar ${isAddUsers && ''}`}>
                  {selectedChat?.isGroupChat ?
                        (<GroupInfo messages={messages} isAddUsers={isAddUsers} setIsAddUsers={setIsAddUsers} />) :
                        (<ChatInfo conversationUser={conversationUser} messages={messages} />)}
                  <CloseIcon className="absolute top-5 right-5 dark:text-dark-primary-text cursor-pointer !text-2xl md:!text-3xl" onClick={() => setChatMode('chat')} />
            </div>
      )
}

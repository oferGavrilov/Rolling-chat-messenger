import React, { useState } from 'react'
import useStore from "../../../context/store/useStore"
import { IUser } from "../../../model/user.model"

import ChatInfo from "./ChatInfo"
import GroupInfo from "./GroupInfo"

interface Props {
      conversationUser: IUser | null
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
}

export default function Info ({ conversationUser, setChatMode }: Props): JSX.Element {
      const { selectedChat, messages } = useStore()
      const [isAddUsers, setIsAddUsers] = useState<boolean>(false)

      return (
            <div className={`flex flex-col items-center relative slide-right overflow-y-auto hide-scrollbar ${isAddUsers && ''}`}>
                  {selectedChat?.isGroupChat ?
                        (<GroupInfo messages={messages} isAddUsers={isAddUsers} setIsAddUsers={setIsAddUsers} />) :
                        (<ChatInfo conversationUser={conversationUser} messages={messages} />)}
                  <span className="material-symbols-outlined absolute top-5 right-5 dark:text-dark-primary-text cursor-pointer !text-2xl md:!text-3xl" onClick={() => setChatMode('chat')}>close</span>
            </div>
      )
}

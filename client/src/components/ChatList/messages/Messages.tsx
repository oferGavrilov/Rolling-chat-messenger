import MessageList from './MessageList'
import { useState, useMemo, useEffect } from 'react'
import { chatService } from '../../../services/chat.service'
import useChat from '../../../store/useChat'
import ChatLoading from '../../SkeltonLoading'
import MessagesInput from '../../common/MessagesInput'
import { userService } from '../../../services/user.service'
import { AuthState } from '../../../context/useAuth'
import { User } from '../../../model/user.model'
import { IChat } from '../../../model/chat.model'

interface MessagesProps {
      contentType: string
}

export default function Messages ({ contentType }: MessagesProps) {

      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [filter, setFilter] = useState<string>('')
      const { chats, setChats } = useChat()
      const { user: loggedinUser } = AuthState()

      const filteredChats = useMemo(() => {
            if (filter) {
              return chats.filter((chat: IChat) =>
                chat.users.some((user: User) => user._id !== loggedinUser?._id && user.username.toLowerCase().includes(filter.toLowerCase()))
              );
            }
            if (contentType === 'groups') {
              return chats.filter((chat: IChat) => chat.isGroupChat);
            }
            return chats;
          }, [chats, filter, contentType, loggedinUser]);

      useEffect(() => {
            async function loadChats (): Promise<void> {
                  setIsLoading(true)
                  const user = await userService.getLoggedinUser()
                  if (!user) return
                  const chats = await chatService.getUserChats(user._id)
                  setChats(chats)
                  setIsLoading(false)
            }

            loadChats()
      }, [setChats])

      return (
            <div className="pt-4 relative">
                  <MessagesInput filter={filter} setFilter={setFilter} />

                  {!isLoading ? (
                        <MessageList chats={filteredChats} />) : (
                        <ChatLoading type="chats" />)}
            </div>
      )
}

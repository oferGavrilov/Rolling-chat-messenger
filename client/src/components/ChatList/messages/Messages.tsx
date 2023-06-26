import MessageList from './MessageList'
import MessageFilter from './MessageFilter'
import { useState, useMemo, useEffect } from 'react'
import { chatService } from '../../../services/chat.service'
import { userService } from '../../../services/user.service'
import useChat from '../../../store/useChat'
import ChatLoading from '../../Loading'

export default function Messages () {
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [filter, setFilter] = useState<string>('')
      const { chats, setChats } = useChat()

      const filteredChats = useMemo(() => {
            if (filter) {
                  return chats.filter(chat => chat.chatName.toLowerCase().includes(filter.toLowerCase())) 
            }
            return chats;
          }, [chats, filter]);

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
                  <MessageFilter filter={filter} setFilter={setFilter} />

                  {!isLoading ? (
                        <MessageList chats={filteredChats} />
                  ) : (<ChatLoading type="chats" />)}
            </div>
      )
}

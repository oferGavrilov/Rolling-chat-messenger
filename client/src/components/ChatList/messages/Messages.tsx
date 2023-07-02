import MessageList from './MessageList'
import { useState, useMemo, useEffect } from 'react'
import { chatService } from '../../../services/chat.service'
import useChat from '../../../store/useChat'
import ChatLoading from '../../Loading'
import MessagesInput from '../../input/MessagesInput'
import { userService } from '../../../services/user.service'

export default function Messages ({ contentType }: { contentType: string }) {

      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [filter, setFilter] = useState<string>('')
      const { chats, setChats } = useChat()

      const filteredChats = useMemo(() => {
            if (filter) {
                  return chats.filter(chat => chat.chatName.toLowerCase().includes(filter.toLowerCase()))
            }
            if (contentType === 'groups') {
                  return chats.filter(chat => chat.isGroupChat)
            }
            return chats;
      }, [chats, filter, contentType]);

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
      }, [])

      return (
            <div className="pt-4 relative">
                  <MessagesInput filter={filter} setFilter={setFilter} />

                  {!isLoading ? (
                        <MessageList chats={filteredChats} />) : (
                        <ChatLoading type="chats" />)}
            </div>
      )
}

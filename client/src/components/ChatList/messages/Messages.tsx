import MessageList from './MessageList'
import MessageFilter from './MessageFilter'
import { useState, useMemo, useEffect } from 'react'
import { chatService } from '../../../services/chat.service'
import { userService } from '../../../services/user.service'
import useChat from '../../../store/useChat'
import ChatLoading from '../../Loading'

interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Messages ({ setShowSearch }: Props) {

      const [isLoading, setIsLoading] = useState<boolean>(false)
      const { chats, setChats } = useChat()
      const memoizedChats = useMemo(() => {
            return chats
      }, [chats])

      useEffect(() => {
            async function loadChats (): Promise<void> {
                  setIsLoading(true)
                  const user = await userService.getLoggedinUser()
                  const chats = await chatService.getUserChats(user._id)
                  setChats(chats)
                  setIsLoading(false)
            }
            
            loadChats()
      }, [setChats])

      return (
            <div className="pt-7 relative">
                  <MessageFilter setShowSearch={setShowSearch} />

                  {!isLoading ? (
                        <MessageList chats={memoizedChats} />
                  ) : (<ChatLoading type="chats" />)}
            </div>
      )
}

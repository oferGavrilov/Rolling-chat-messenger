import { useEffect, useRef } from 'react'
import useStore from '../../../context/store/useStore'
import { AuthState } from '../../../context/useAuth'
import Messages from './messages/Messages'
import { scrollToBottom } from '../../../utils/functions'

interface Props {
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "edit-file">>
}

export default function Chat({ setChatMode }: Props): JSX.Element {
      const { replyMessage, messages, setMessages } = useStore()
      const { chatBackgroundColor } = AuthState()
      const chatRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
            if (messages.length > 4) {
                  console.log('scrolling to bottom')
                  setTimeout(() => scrollToBottom(chatRef), 100)
            }
      }, [messages, replyMessage, setMessages])

      return (
            <>
                  <div className='chat-bg-color' style={{ backgroundColor: chatBackgroundColor.color }}></div>
                  <div className="chat-bg-img" style={{ opacity: chatBackgroundColor.opacity }} />

                  <div
                        className={`overflow-y-auto overflow-x-hidden slide-left h-full bg-no-repeat bg-cover bg-center`}
                        ref={chatRef}
                  >
                        {messages &&
                              <Messages
                                    messages={messages}
                                    setChatMode={setChatMode}
                              />
                        }
                  </div>
            </>
      )
}

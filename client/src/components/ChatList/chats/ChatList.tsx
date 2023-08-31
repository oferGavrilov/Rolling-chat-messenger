import { useEffect, useRef } from "react"
import { IChat } from "../../../model/chat.model"
import useChat from "../../../store/useChat"

import MessagePreview from "./ChatPreview"
import { IMessage } from '../../../model/message.model'
import { AuthState } from "../../../context/useAuth"
import socketService from "../../../services/socket.service"

export default function ChatList ({ chats }: { chats: IChat[] }) {
      const { notification, addNotification, selectedChat, setSelectedChat, setChats, updateChat } = useChat()
      const { user } = AuthState()
      const isMountedRef = useRef<boolean>(false)


      useEffect(() => {
            if (!user) return

            socketService.on('new group', handleNewGroup)


            return () => {
                  socketService.off('new group', handleNewGroup)
            }
      }, [user])

      useEffect(() => {
            isMountedRef.current = true

            return () => {
                  isMountedRef.current = false
            }
      }, [])

      useEffect(() => {
            socketService.on('message removed', ({ messageId, chatId, removerId, isLastMessage }: { messageId: string, chatId: string, removerId: string, isLastMessage: boolean }) => {
                  console.log('message removed', messageId, removerId, isLastMessage)
                  console.log('chatId', chatId)

                  // if the message that was removed while the user was in the chat
                  if (selectedChat?._id === chatId) {
                        console.log('selectedChat')
                        setSelectedChat({ ...selectedChat })
                  }

                  // if the message that was removed while the user was not in the chat and it was the last message
                  if (!isLastMessage) return

                  const chatIndex = chats.findIndex((chat) => chat._id === chatId);

                  if (chatIndex !== -1) {
                        const updatedChats = [...chats];
                        const chatToUpdate = updatedChats[chatIndex];
                        
                        if (chatToUpdate.latestMessage) {
                              const deletedByArray = chatToUpdate.latestMessage.deletedBy || [];
                              if (!deletedByArray.includes(removerId)) {
                                    deletedByArray.push(removerId);
                                    chatToUpdate.latestMessage.deletedBy = deletedByArray;
                                    // Now you can set the state to the updated chats array
                                    console.log('updatedChats', updatedChats[chatIndex])
                                    setChats(updatedChats);
                              }
                        }
                  }



                  // setSelectedChat({ ...selectedChat } as IChat)


                  // const chatIndex = chats.findIndex((chat) => chat._id === selectedChat?._id);
                  // if (chatIndex !== -1) {
                  //       const updatedChats = [...chats];
                  //       const chatToUpdate = updatedChats[chatIndex];

                  //       if (chatToUpdate.latestMessage) {
                  //             const deletedByArray = chatToUpdate.latestMessage.deletedBy || [];
                  //             if (!deletedByArray.includes(userId)) {
                  //                   deletedByArray.push(userId);
                  //                   chatToUpdate.latestMessage.deletedBy = deletedByArray;
                  //                   // Now you can set the state to the updated chats array
                  //                   console.log('updatedChats', updatedChats[chatIndex])
                  //                   setChats(updatedChats);
                  //             }
                  //       }
                  // }

            })

            return () => {
                  socketService.off('message removed')
            }
      }, [selectedChat])

      useEffect(() => {
            socketService.on("message received", (newMessage: IMessage) => {
                  if (isMountedRef.current) {
                        if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
                              const isChatExists = chats.find((chat) => chat._id === newMessage.chat._id)
                              if (!isChatExists) {
                                    setChats([newMessage.chat, ...chats])
                              }
                              addNotification(newMessage)
                              updateChat(newMessage)
                              document.title = `${notification.length > 0 ? `(${notification.length})` : ""} Rolling`
                        }
                  }
            })

            return () => {
                  socketService.off("message received")
            }
      }, [selectedChat])

      function handleNewGroup (chat: IChat) {
            setChats([chat, ...chats])
      }
      return (
            <div className="overflow-y-auto h-[79vh]">
                  <ul className="px-1">
                        {chats.map(chat => (
                              <MessagePreview key={chat._id} chat={chat} notification={notification} />
                        ))}
                  </ul>
            </div>
      )
}

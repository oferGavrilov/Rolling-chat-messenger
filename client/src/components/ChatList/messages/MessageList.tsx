import { useEffect, useRef } from "react"
import { IChat } from "../../../model/chat.model"
import useChat from "../../../store/useChat"

import MessagePreview from "./MessagePreview"
import { IMessage } from '../../../model/message.model'
import { AuthState } from "../../../context/useAuth"
import socketService from "../../../services/socket.service"

export default function MessageList ({ chats }: { chats: IChat[] }) {
      const { notification, addNotification, selectedChat, setChats, updateChat } = useChat()
      const { user } = AuthState()

      const latestMessageIdRef = useRef<string | null>(null);

      useEffect(() => {
            if (!user) return

            socketService.on('new group', handleNewGroup);

            return () => {
                  socketService.off('new group', handleNewGroup);
            };
      }, [user]);

      useEffect(() => {
            const handleNewMessage = (newMessage: IMessage) => {
                  console.log("new notification", newMessage);
                  if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
                        const isChatExists = chats.find((chat) => chat._id === newMessage.chat._id);
                        if (!isChatExists) setChats([newMessage.chat, ...chats]);

                        // Check if the message is already processed
                        if (latestMessageIdRef.current !== newMessage._id) {
                              latestMessageIdRef.current = newMessage._id; // Update the latest processed message ID
                              addNotification(newMessage);
                              updateChat(newMessage);
                              document.title = `${notification.length > 0 ? `(${notification.length})` : ""} Rolling`;
                        }
                  }
            };

            socketService.on("message received", handleNewMessage);

            // Clean up
            return () => {
                  socketService.off("message received", handleNewMessage);
                  latestMessageIdRef.current = null; // Reset the latest processed message ID when the component unmounts
            };
      }, [selectedChat]);

      function handleNewGroup (chat: IChat) {
            console.log(chat)
            setChats([chat, ...chats])
      }



      return (
            <ul className="overflow-y-auto h-screen pb-48 px-1">
                  {chats.map(chat => (
                        <MessagePreview key={chat._id} chat={chat} notification={notification} />
                  ))}
            </ul>
      )
}

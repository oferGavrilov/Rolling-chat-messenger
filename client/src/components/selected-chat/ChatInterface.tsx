import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { AuthState } from "../../context/useAuth"
import useStore from "../../context/store/useStore"

const ChatHeader = lazy(() => import("./chat/ChatHeader"));
const Info = lazy(() => import("./info/Index"));
const Chat = lazy(() => import("./chat/Chat"));
const FileEditor = lazy(() => import("./file/FileEditor"));
const TextPanel = lazy(() => import("./chat/TextPanel"));

import socketService from "../../services/socket.service"
import { chatService } from "../../services/chat.service"

import { IMessage, IReplyMessage } from "../../model/message.model"
import { IUser } from "../../model/user.model"
import { IChat } from "../../model/chat.model"
import { messageService } from "../../services/message.service"
import Loading from "../Loading";
import { toast } from "react-toastify";

export default function ChatInterface(): JSX.Element {
      const [conversationUser, setConversationUser] = useState<IUser | null>(null)
      const [chatMode, setChatMode] = useState<"chat" | "info" | "send-file">('chat')
      const [file, setFile] = useState<File | null>(null)
      const { selectedChat, setSelectedChat, updateChatWithLatestMessage, setChats, setReplyMessage, messages, setMessages, removeMessage, bringChatToTop } = useStore()
      const { user: loggedInUser } = AuthState()

      const conversationUserRef = useRef<IUser | null>(null)

      useEffect(() => {
            const handleKickUser = (chatId: string, userId: string, kickerId: string, chat: IChat | null) => {
                  if (chat?._id === chatId) {
                        if (!selectedChat) return
                        const updatedChat = {
                              ...selectedChat,
                              kickedUsers: [...selectedChat.kickedUsers, { userId, kickedBy: kickerId, kickedAt: new Date().toString() }],
                              users: selectedChat.users.filter(user => user._id !== userId)
                        }
                        isKicked()
                        setSelectedChat(updatedChat)
                  }
            }

            const handleAddUser = (chatId: string, user: IUser, chat: IChat | null) => {
                  if (chat?._id !== chatId) return
                  if (!selectedChat) return
                  const updatedChat = {
                        ...selectedChat,
                        kickedUsers: selectedChat.kickedUsers.filter(kickedUser => kickedUser.userId !== user._id),
                        users: [...selectedChat.users, user]
                  }
                  isKicked()
                  setSelectedChat(updatedChat)
            }

            const handleLeftUser = (chatId: string, userId: string, chat: IChat | null) => {
                  if (chat?._id !== chatId) return
                  if (!selectedChat) return
                  const updatedChat = {
                        ...selectedChat,
                        users: selectedChat.users.filter(chatUser => chatUser._id !== userId)
                  }
                  setSelectedChat(updatedChat)
            }

            const handleRemoveMessage = (messageId: string, chatId: string, removerId: string, deleteAction: 'forMe' | 'forEveryone') => {
                  removeMessage(messageId, chatId, removerId, deleteAction);
            }

            socketService.on('user-kicked', ({ chatId, userId, kickerId }) => handleKickUser(chatId, userId, kickerId, selectedChat))
            socketService.on('user-joined', ({ chatId, user }) => handleAddUser(chatId, user, selectedChat))
            socketService.on('user-left', ({ chatId, userId }) => handleLeftUser(chatId, userId, selectedChat))
            socketService.on('message removed', ({ messageId, chatId, removerId, deleteAction }) => handleRemoveMessage(messageId, chatId, removerId, deleteAction))

            fetchConversationUser()
            setChatMode('chat')

            return () => {
                  socketService.off('user-kicked')
                  socketService.off('user-joined')
                  socketService.off('user-left')
                  socketService.off('message removed')
            }
      }, [selectedChat])

      useEffect(() => {
            if (!loggedInUser) return

            socketService.on('message received', (newMessage: IMessage) => {
                  // update the chat with the latest message
                  updateChatWithLatestMessage(newMessage)
                  setMessages((prevMessages) => [...prevMessages, newMessage])

                  // if the other user is in the chat, emit read-messages
                  if (selectedChat && selectedChat._id === newMessage.chat?._id) {
                        socketService.emit('read-messages', {
                              chatId: selectedChat._id,
                              userId: loggedInUser._id,
                              messages: [newMessage._id]
                        })
                  }
            })

            return () => {
                  socketService.off('message received')
            }
      }, [selectedChat, setMessages, updateChatWithLatestMessage])

      useEffect(() => {
            socketService.on('message-read', ({ chatId, userId, messages }: { chatId: string, userId: string, messages: string[] }) => {
                  if (selectedChat?._id === chatId) {
                        setMessages((prevMessages) => prevMessages.map(msg => messages.includes(msg._id) ? { ...msg, isReadBy: msg.isReadBy?.concat({ userId, readAt: new Date() }) } : msg))
                  }
            })

            return () => {
                  socketService.off('message-read')
            }
      }, [selectedChat, setMessages])

      function fetchConversationUser(): void {
            const conversationUser = selectedChat?.users.find((user) => user._id !== loggedInUser?._id) || selectedChat?.users[0]
            if (conversationUser) {
                  setConversationUser(conversationUser)
                  conversationUserRef.current = conversationUser
            }
      }

      async function onSendMessage(
            message: string | File,
            messageType: "text" | "image" | "audio" | "file",
            replyMessage: IReplyMessage | null,
            size?: number
      ): Promise<void> {
            if (!selectedChat || !message || !loggedInUser) return

            const optimisticMessage: IMessage = {
                  _id: 'temp-id',
                  sender: loggedInUser,
                  messageType,
                  content: message,
                  chatId: selectedChat._id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  replyMessage,
                  messageSize: size !== undefined ? Math.floor(size) : undefined,
                  deletedBy: [],
                  isReadBy: [{ userId: loggedInUser?._id as string, readAt: new Date() }],
            }

            // Show the message immediately
            setReplyMessage(null)
            setMessages([...messages, optimisticMessage])
            bringChatToTop(optimisticMessage)

            try {
                  let updatedChat: IChat | undefined = selectedChat
                  // Chats that are not created yet have _id = 'temp-id'
                  if (selectedChat._id === 'temp-id') {
                        const targetUser: string = selectedChat.users.find(user => user._id !== loggedInUser._id)?._id as string;
                        const newChat = await chatService.createChat(targetUser);
                        if (!newChat) {
                              toast.error('Failed to create chat');
                              return;
                        }

                        updatedChat = newChat;
                        setSelectedChat({ ...newChat, isNewChat: true }); // add this flag to prevent fetching messages because the chat is getting a new id
                        setChats(prevChats => [newChat, ...prevChats]);
                        socketService.emit('join chat', { chatId: newChat._id, userId: loggedInUser._id });
                  }
                  const realMessage = await messageService.sendMessage({
                        content: message,
                        chatId: updatedChat._id,
                        messageType: messageType,
                        replyMessage,
                        messageSize: size !== undefined ? Math.floor(size) : undefined,
                  })

                  // Update messages with the real message details
                  setMessages(prevMessages =>
                        prevMessages.map(msg => msg._id === 'temp-id' ? { ...msg, ...realMessage } : msg)
                  );

                  setChats(prevChats =>
                        prevChats.map(chat =>
                              chat._id === updatedChat?._id ? { ...chat, latestMessage: realMessage } : chat
                        )
                  );

                  socketService.emit('new message in room', { chatId: updatedChat._id, message: realMessage, chatUsers: updatedChat.users });

            } catch (error) {
                  console.error('Failed to send message:', error)
                  setMessages([...messages])
            } finally {
                  if (chatMode !== 'chat') setChatMode('chat')
            }
      }

      function isKicked(): boolean {
            if (!selectedChat) return false
            return selectedChat?.kickedUsers?.some(kickedUser => kickedUser.userId === loggedInUser?._id) as boolean
      }

      if (!selectedChat) return <div></div>
      return (
            <Suspense fallback={<Loading />}>
                  <section className='flex-1 grid h-full overflow-hidden slide-left max-h-screen' style={{ gridTemplateRows: chatMode === 'chat' ? '64px 1fr 64px' : '64px 1fr' }}>

                        <ChatHeader
                              conversationUser={conversationUser}
                              chatMode={chatMode}
                              setChatMode={setChatMode}
                              conversationUserRef={conversationUserRef}
                        />

                        {chatMode === 'chat' && (
                              <Chat
                                    setChatMode={setChatMode}
                              />
                        )}
                        {chatMode === 'info' && (
                              <Info
                                    conversationUser={conversationUser}
                                    setChatMode={setChatMode}
                              />
                        )}
                        {chatMode === 'send-file' && (
                              <FileEditor
                                    file={file}
                                    setChatMode={setChatMode}
                                    sendMessage={onSendMessage}
                              />
                        )}

                        {(chatMode === 'chat' && !isKicked()) && (
                              <TextPanel
                                    onSendMessage={onSendMessage}
                                    setFile={setFile}
                                    setChatMode={setChatMode}
                              />
                        )}

                  </section>
            </Suspense>
      )
}

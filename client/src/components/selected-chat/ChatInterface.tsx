import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react"
import { AuthState } from "../../context/useAuth"
import useStore from "../../context/store/useStore"
import { IMessage, IReplyMessage, IUser, IChat } from "../../model"

const ChatHeader = lazy(() => import("./chat/ChatHeader"))
const Info = lazy(() => import("./info/Index"))
const Chat = lazy(() => import("./chat/Chat"))
const FileEditor = lazy(() => import("./file/FileEditor"))
const TextPanel = lazy(() => import("./chat/TextPanel"))

import socketService from "../../services/socket.service"
import { SocketEmitEvents } from "../../utils/socketEvents"

import { chatService } from "../../services/chat.service"
import { messageService } from "../../services/message.service"

import Loading from "../Loading"
import { toast } from "react-toastify"

export default function ChatInterface(): JSX.Element {
      const [conversationUser, setConversationUser] = useState<IUser | null>(null)
      const [chatMode, setChatMode] = useState<"chat" | "info" | "edit-file">('chat')
      const [file, setFile] = useState<File | null>(null)
      const { selectedChat, setSelectedChat, setChats, setReplyMessage, messages, setMessages, bringChatToTop, updateChatReadReceipts, setBlobUrls } = useStore()
      const { user: loggedInUser } = AuthState()

      const conversationUserRef = useRef<IUser | null>(null)

      useEffect(() => {
            if (!selectedChat || !loggedInUser) return

            const joinChat = async () => {
                  if (selectedChat._id === 'temp-id') return
                  socketService.emit(SocketEmitEvents.JOIN_ROOM, { chatId: selectedChat._id, userId: loggedInUser._id })
                  setReplyMessage(null)
            }

            joinChat()

            return () => {
                  if (selectedChat && selectedChat._id !== 'temp-id') {
                        socketService.emit(SocketEmitEvents.LEAVE_ROOM, { chatId: selectedChat._id, userId: loggedInUser._id })
                  }
            }

      }, [selectedChat, loggedInUser, setReplyMessage])

      useEffect(() => {
            loadConversationUserInfo()
            setChatMode('chat')
      }, [selectedChat?._id])

      function loadConversationUserInfo(): void {
            if (!selectedChat || !loggedInUser) return

            const conversationUser = selectedChat?.users.find((user) => user._id !== loggedInUser?._id) || selectedChat?.users[0]
            if (conversationUser) {
                  setConversationUser(conversationUser)
                  conversationUserRef.current = conversationUser
            }
      }

      async function onSendMessage(
            content: string,
            messageType: "text" | "image" | "audio" | "file",
            replyMessage: IReplyMessage | null,
            size?: number,
            file?: File
      ): Promise<void> {
            if (!selectedChat || !loggedInUser) return

            // if the message type is text and the content is empty, return
            if (messageType === 'text' && content.trim() === '') return

            // create objectUrl for the image or file to show it immediately
            const objectUrl = (messageType === 'image' || messageType === 'file') ? URL.createObjectURL(file as File) : ''
            const optimisticMessage: IMessage = {
                  _id: 'temp-id',
                  sender: loggedInUser,
                  messageType,
                  content: content,
                  TN_Image: messageType === 'file' ? objectUrl : '',
                  chatId: selectedChat._id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  replyMessage,
                  messageSize: size !== undefined ? Math.floor(size) : undefined,
                  deletedBy: [],
                  isReadBy: [{ userId: loggedInUser._id as string, readAt: new Date() }],
                  fileName: file?.name,
                  fileUrl: (messageType === 'image' || messageType === 'file') ? objectUrl : ''
            }

            console.log('optimisticMessage:', optimisticMessage)

            // Show the message immediately
            setReplyMessage(null)
            setMessages(prevMessages => [...prevMessages, optimisticMessage])
            bringChatToTop(optimisticMessage)

            // when the message type is image, we keep the blob url in blobUrls state to revoke it when the user leaves the chat or the message is deleted
            if ((messageType === 'image') && file) {
                  setBlobUrls(prevBlobUrls => [...prevBlobUrls, URL.createObjectURL(file)])
            }

            try {
                  let updatedChat: IChat | undefined = selectedChat
                  // Chats that are not created yet have _id = 'temp-id'
                  if (selectedChat._id === 'temp-id') {
                        const targetUser: string = selectedChat.users.find(user => user._id !== loggedInUser._id)?._id as string
                        const newChat = await chatService.createChat(targetUser)
                        if (!newChat) {
                              toast.error('Failed to create chat')
                              return
                        }

                        updatedChat = newChat
                        setSelectedChat({ ...newChat, isNewChat: true }) // add this flag to prevent fetching messages because the chat is getting a new id
                        setChats(prevChats => [newChat, ...prevChats])
                        socketService.emit(SocketEmitEvents.JOIN_ROOM, { chatId: newChat._id, userId: loggedInUser._id })
                  }
                  const realMessage = await messageService.sendMessage({
                        content: content,
                        chatId: updatedChat._id,
                        messageType: messageType,
                        replyMessage,
                        messageSize: size !== undefined ? Math.floor(size) : undefined,
                        file
                  })

                  // Update the message with the real one, and when the message is image or file, don't change the fileUrl.
                  setMessages((prevMessages) =>
                        prevMessages.map((msg) => {
                              if (msg._id === 'temp-id') {
                                    if (messageType === 'image' || messageType === 'file') {
                                          return {
                                                ...realMessage,
                                                content: msg.content,
                                                TN_Image: realMessage.TN_Image,
                                                fileUrl: msg.fileUrl,
                                                fileName: msg.fileName,
                                                messageSize: realMessage.messageSize,
                                          };
                                    } else {
                                          return realMessage;
                                    }
                              }
                              return msg;
                        })
                  );

                  setChats(prevChats =>
                        prevChats.map(chat =>
                              chat._id === updatedChat?._id ? {
                                    ...chat,
                                    latestMessage: {
                                          ...realMessage,
                                    }
                              } : chat
                        )
                  )

                  socketService.emit(SocketEmitEvents.NEW_MESSAGE, { chatId: updatedChat._id, message: realMessage, chatUsers: updatedChat.users, senderId: loggedInUser._id })

            } catch (errMsg) {
                  if (errMsg && typeof errMsg === 'string') {
                        toast.error(errMsg)
                  }
                  setMessages([...messages])
            } finally {
                  if (chatMode !== 'chat') setChatMode('chat')
            }
      }

      const fetchMessages = useCallback(async (): Promise<void> => {
            if (!selectedChat || selectedChat._id === 'temp-id' || !loggedInUser || selectedChat?.isNewChat) return

            try {
                  const { messages: fetchedMessages, newlyReadMessageIds }: { messages: IMessage[], newlyReadMessageIds: string[] } = await messageService.getMessages(selectedChat._id)

                  if (newlyReadMessageIds.length > 0) {
                        // update the current chat that the user has read the messages
                        setChats(prevChats =>
                              prevChats.map(chat =>
                                    chat._id === selectedChat?._id ? {
                                          ...chat,
                                          latestMessage: {
                                                ...fetchedMessages[fetchedMessages.length - 1],
                                          },
                                          unreadMessagesCount: 0
                                    } : chat
                              )
                        )

                        socketService.emit(SocketEmitEvents.READ_MESSAGES, { chatId: selectedChat._id, userId: loggedInUser._id, messageIds: newlyReadMessageIds })
                  }

                  setMessages(fetchedMessages)
            } catch (error) {
                  console.error('Failed to fetch messages:', error)
            }
      }, [selectedChat?._id, loggedInUser, setMessages, updateChatReadReceipts])

      useEffect(() => {
            if (selectedChat && selectedChat._id !== 'temp-id' && !selectedChat.isNewChat) {
                  fetchMessages()
            }
      }, [selectedChat?._id, selectedChat?.isNewChat, loggedInUser?._id])

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
                        {chatMode === 'edit-file' && (
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

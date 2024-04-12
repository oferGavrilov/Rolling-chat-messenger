import { useEffect, useState } from 'react'

import Navigation from '../components/Navigation'
import DynamicSideModal from '../components/side-modal/DynamicSideModal'
import DynamicList from '../components/dynamic-list/DynamicList'
import ChatInterface from '../components/selected-chat/ChatInterface'
import SelectedFile from '../components/selected-file/SelectedFile'

import useStore from '../context/store/useStore'
import { AuthState } from '../context/useAuth'
import { userService } from '../services/user.service'
// import socketService from '../services/socket.service'
import SelectedImage from '../components/gallery-editor/selected-image'
import socketService from '../services/socket.service'
import { SocketEmitEvents, SocketOnEvents } from "../utils/socketEvents"

import { IChat, IMessage, IUser } from '../model'
import { chatService } from '../services/chat.service'

export type ContentType = 'chats' | 'groups' | 'gallery' | 'videos' | 'story' | 'settings' | 'profile'

export default function ChatPage(): JSX.Element {
      const [showSearch, setShowSearch] = useState<boolean>(false)
      const [contentType, setContentType] = useState<ContentType>('chats')
      const [showNavigation, setShowNavigation] = useState<boolean>(true)
      const [isLoadingChats, setIsLoadingChats] = useState<boolean>(false)
      const { selectedChat, selectedFile, selectedImage, chats, setChats, setSelectedChat, setMessages } = useStore()
      const { user } = AuthState()

      // group operations listeners
      useEffect(() => {
            socketService.on(SocketOnEvents.GROUP_INFO_UPDATED, ({ chatId, updateType, updateData }: { chatId: string, updateType: 'image' | 'name', updateData: string }) => {
                  // update the current chat with the updated group info
                  if (chatId === selectedChat?._id) {
                        setSelectedChat(prev => {
                              if (!prev) return prev
                              return {
                                    ...prev,
                                    [updateType === 'image' ? 'groupImage' : 'chatName']: updateData
                              }
                        })
                  }

                  // update the chat from chats array with the updated group info
                  setChats(prevChats => {
                        const updatedChats = prevChats.map(chat => {
                              if (chat._id === chatId) {
                                    return {
                                          ...chat,
                                          [updateType === 'image' ? 'groupImage' : 'chatName']: updateData
                                    }
                              }
                              return chat
                        })
                        return updatedChats
                  })
            })

            socketService.on(SocketOnEvents.GROUP_USER_JOINED, ({ chatId, newUsers }: { chatId: string, newUsers: IUser[] }) => {
                  // update the users array when a user joins the group
                  if (selectedChat?._id === chatId) {
                        setSelectedChat(prev => {
                              if (!prev) return prev
                              return {
                                    ...prev,
                                    users: newUsers
                              }
                        })
                  }

                  // update the chat users array from chats array with the new users
                  setChats(prevChats => {
                        const updatedChats = prevChats.map(chat => {
                              if (chat._id === chatId) {
                                    return {
                                          ...chat,
                                          users: newUsers
                                    }
                              }
                              return chat
                        })
                        return updatedChats
                  })
            })

            socketService.on(SocketOnEvents.GROUP_USER_KICKED, ({ chatId, kickedUserId }: { chatId: string, kickedUserId: string }) => {
                  // update the selected chat users array without the kicked user
                  if (selectedChat?._id === chatId) {
                        setSelectedChat(prev => {
                              if (!prev) return prev
                              return {
                                    ...prev,
                                    users: prev.users.filter(user => user._id !== kickedUserId)
                              }
                        })
                  }

                  // update the chat users array from chats array without the kicked user
                  setChats(prevChats => {
                        const updatedChats = prevChats.map(chat => {
                              if (chat._id === chatId) {
                                    return {
                                          ...chat,
                                          users: chat.users.filter(user => user._id !== kickedUserId)
                                    }
                              }
                              return chat
                        })
                        return updatedChats
                  })
            })

            socketService.on(SocketOnEvents.GROUP_USER_LEFT, ({ chatId, leaverId }: { chatId: string, leaverId: string }) => {
                  // update the selected chat users array without the leaver
                  if (selectedChat?._id === chatId) {
                        setSelectedChat(prev => {
                              if (!prev) return prev
                              return {
                                    ...prev,
                                    users: prev.users.filter(user => user._id !== leaverId)
                              }
                        })
                  }

                  // update the chat users array from chats array without the leaver
                  setChats(prevChats => {
                        const updatedChats = prevChats.map(chat => {
                              if (chat._id === chatId) {
                                    return {
                                          ...chat,
                                          users: chat.users.filter(user => user._id !== leaverId)
                                    }
                              }
                              return chat
                        })
                        return updatedChats
                  })
            })

            socketService.on(SocketOnEvents.USER_KICKED, ({ chatId, kickedUserId, kickerId }: { chatId: string, kickedUserId: string, kickerId: string }) => {
                  if (kickedUserId !== user?._id) return

                  if (selectedChat?._id === chatId) {
                        // update the selected chat kickedUsers array with the kicked user and kicker
                        setSelectedChat(prev => {
                              if (!prev) return prev
                              return {
                                    ...prev,
                                    kickedUsers: [
                                          ...prev.kickedUsers,
                                          {
                                                userId: kickedUserId,
                                                kickedBy: kickerId,
                                                kickedAt: new Date().toISOString()
                                          }
                                    ]
                              }
                        })
                  }

                  // update the chats array kickedUsers array with the kicked user and kicker
                  setChats(prevChats => {
                        const updatedChats = prevChats.map(chat => {
                              if (chat._id === chatId) {
                                    return {
                                          ...chat,
                                          kickedUsers: [
                                                ...chat.kickedUsers,
                                                {
                                                      userId: kickedUserId,
                                                      kickedBy: kickerId,
                                                      kickedAt: new Date().toISOString()
                                                }
                                          ]
                                    }
                              }
                              return chat
                        })
                        return updatedChats
                  })
            })

            socketService.on(SocketOnEvents.USER_JOINED, async ({ chatId, userId }: { chatId: string, userId: string }) => {
                  // update the chats array when the logged-in user is added to group

                  if (userId !== user?._id) return // event is for the logged-in user

                  try {
                        if (selectedChat?._id === chatId) {
                              // update the selected chat kickedUsers array without the logged-in user
                              setSelectedChat(prev => {
                                    if (!prev) return prev
                                    return {
                                          ...prev,
                                          kickedUsers: prev.kickedUsers.filter(kickedUser => kickedUser.userId !== userId)
                                    }
                              })

                              // emit the user-joined event to the server
                              socketService.emit(SocketEmitEvents.JOIN_ROOM, { chatId, userId })

                        }

                        const isChatExists = chats.some(chat => chat._id === chatId)

                        //if the chat exists - update the chat from chats array with the logged-in user removed from kickedUsers array
                        if (isChatExists) {
                              setChats(prevChats => {
                                    const updatedChats = prevChats.map(chat => {
                                          if (chat._id === chatId) {
                                                return {
                                                      ...chat,
                                                      kickedUsers: chat.kickedUsers.filter(kickedUser => kickedUser.userId !== userId)
                                                }
                                          }
                                          return chat
                                    })
                                    return updatedChats
                              })
                        } else {
                              // if chat not exists - get the chat from the server and update the chats array
                              const newChat: IChat = await chatService.getChatById(chatId)
                              setChats(prevChats => {
                                    if (newChat) {
                                          return [newChat, ...prevChats]
                                    } else {
                                          return prevChats
                                    }
                              })
                        }

                  } catch (err) {
                        console.error(err)
                  }
            })

            return () => {
                  socketService.off(SocketOnEvents.GROUP_INFO_UPDATED)
                  socketService.off(SocketOnEvents.GROUP_USER_JOINED)
                  socketService.off(SocketOnEvents.GROUP_USER_KICKED)
                  socketService.off(SocketOnEvents.GROUP_USER_LEFT)
                  socketService.off(SocketOnEvents.USER_KICKED)
                  socketService.off(SocketOnEvents.USER_JOINED)
            }
      }, [selectedChat?._id, chats, setChats, setSelectedChat])

      // chat operations listeners
      useEffect(() => {
            if (!user) return
            // listen for new message in the selected chat
            socketService.on(SocketOnEvents.NEW_MESSAGE_IN_ROOM, ({ chatId, message }: { chatId: string, message: IMessage }) => {
                  //if the chatId is the selected chat, update the messages array with the new message
                  if (selectedChat?._id === chatId) {
                        setMessages(prevMessages => {
                              return [...prevMessages, message]
                        })
                  }

                  // update the chat from chats array with the latest message
                  setChats(prevChats => {
                        const updatedChats = prevChats.map(chat => {
                              if (chat._id === chatId) {
                                    return {
                                          ...chat,
                                          latestMessage: { ...message, isReadBy: [{ userId: user._id, readAt: new Date() }] },
                                          unreadMessagesCount: chat._id === chatId ? 0 : chat.unreadMessagesCount + 1
                                    }
                              }
                              return chat
                        })
                        return updatedChats
                  })

                  // emit the read message event with the new message id
                  socketService.emit(SocketEmitEvents.READ_MESSAGES, { chatId, userId: user._id, messageIds: [message._id] })
            })

            // handle the messages read event from the server
            socketService.on(SocketOnEvents.MESSAGES_READ, ({ chatId, userId, messageIds }: { chatId: string, userId: string, messageIds: string[] }) => {
                  console.log('messages read:', chatId, userId, messageIds)

                  if (selectedChat?._id === chatId) {
                        // update all the messages with the readBy array with the userId and readAt
                        setMessages(prevMessages => {
                              return prevMessages.map(message => {
                                    if (messageIds.includes(message._id)) {
                                          return {
                                                ...message,
                                                isReadBy: [
                                                      ...message.isReadBy,
                                                      {
                                                            userId,
                                                            readAt: new Date()
                                                      }
                                                ]
                                          }
                                    }
                                    return message
                              })
                        })
                  }

                  // update the chat from chats array with the read messages
                  setChats(prevChats => {
                        const updatedChats = prevChats.map(chat => {
                              if (chat._id === chatId && chat.latestMessage) {
                                    return {
                                          ...chat,
                                          latestMessage: {
                                                ...chat.latestMessage,
                                                unreadMessagesCount: 0,
                                                isReadBy: [
                                                      ...chat.latestMessage.isReadBy,
                                                      {
                                                            userId,
                                                            readAt: new Date()
                                                      }
                                                ]
                                          }
                                    }
                              }
                              return chat
                        })
                        return updatedChats
                  })
            })

            socketService.on(SocketOnEvents.REMOVED_MESSAGE, ({ messageId, chatId, removerId }: { messageId: string, chatId: string, removerId: string }) => {
                  console.log('message removed:', messageId, chatId, removerId)

                  // add to the message removedBy array the userId: removerId, deletionType: 'forEveryone'  
                  setMessages(prevMessages => {
                        return prevMessages.map(message => {
                              if (message._id === messageId) {
                                    return {
                                          ...message,
                                          deletedBy: [
                                                ...message.deletedBy,
                                                {
                                                      userId: removerId,
                                                      deletionType: 'forEveryone'
                                                }
                                          ]
                                    }
                              }
                              return message
                        })
                  })
            })

            // handle the notification received event from the server
            socketService.on(SocketOnEvents.NOTIFICATION_RECEIVED, ({ chatId, message }: { chatId: string, message: IMessage }) => {
                  console.log('notification received:', chatId, message)
                  // check if the chatId is exists in the chats array
                  const isChatExists = chats.some(chat => chat._id === chatId)
                  if (!isChatExists) {
                        setChats(prevChats => {
                              return [
                                    {
                                          _id: chatId,
                                          ...message.chat,
                                          chatName: message.chat?.chatName || '',
                                          isGroupChat: message.chat?.isGroupChat || false,
                                          users: message.chat?.users || [],
                                          kickedUsers: message.chat?.kickedUsers || [],
                                          latestMessage: message,
                                          unreadMessagesCount: 1
                                    },
                                    ...prevChats
                              ]
                        })
                  } else {
                        // todo: should also set the chat on top of the chats array
                        setChats(prevChats => {
                              const updatedChats = prevChats.map(chat => {
                                    if (chat._id === chatId) {
                                          return {
                                                ...chat,
                                                latestMessage: message,
                                                unreadMessagesCount: chat.unreadMessagesCount + 1
                                          }
                                    }
                                    return chat
                              })
                              return updatedChats
                        })
                  }
            })

            return () => {
                  socketService.off(SocketOnEvents.NEW_MESSAGE_IN_ROOM)
                  socketService.off(SocketOnEvents.MESSAGES_READ)
                  socketService.off(SocketOnEvents.REMOVED_MESSAGE)
                  socketService.off(SocketOnEvents.NOTIFICATION_RECEIVED)
            }
      }, [selectedChat?._id, setMessages, setChats, setSelectedChat, chats])

      async function loadChats(): Promise<void> {
            try {
                  setIsLoadingChats(true)
                  let chats = await chatService.getUserChats()
                  setChats(chats)
            } catch (err) {
                  console.log(err)
            } finally {
                  setIsLoadingChats(false)
            }
      }

      useEffect(() => {
            if (!user) return

            socketService.setup(user._id)

            // load the user chats
            loadChats()

            const theme = userService.getTheme()
            switch (theme) {
                  case 'dark':
                        document.body.style.backgroundColor = '#222e35'
                        document.body.classList.add('dark')
                        break
                  case 'light':
                        document.body.style.backgroundColor = '#ffffff'
                        document.body.classList.remove('dark')
                        break
            }

            return () => {
                  document.body.style.backgroundColor = '#ffffff'
                  document.body.classList.remove('dark')
            }
      }, [])

      if (!user) return <div></div>
      return (
            <div className='overflow-hidden flex h-[100svh] dark:bg-dark-secondary-bg' data-testid="chat-page">
                  <div className='flex flex-1 slide-right md:overflow-hidden'>
                        <Navigation
                              contentType={contentType}
                              setContentType={setContentType}
                              showNavigation={showNavigation}
                              setShowNavigation={setShowNavigation}
                        />
                        <DynamicList
                              contentType={contentType}
                              setContentType={setContentType}
                              setShowSearch={setShowSearch}
                              showNavigation={showNavigation}
                              setShowNavigation={setShowNavigation}
                              isLoadingChats={isLoadingChats}
                        />

                        {selectedChat && <ChatInterface />}
                        {selectedImage && <SelectedImage />}
                  </div>
                  {selectedFile && (
                        <SelectedFile />
                  )}

                  <DynamicSideModal
                        contentType={contentType}
                        isOpen={showSearch}
                        setIsOpen={setShowSearch}
                  />
            </div>
      )


}

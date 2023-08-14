import { create } from 'zustand'
import { IChat } from '../model/chat.model'
import { IMessage } from '../model/message.model'

interface ChatState {
      chats: IChat[]
      selectedChat: IChat | null
      notification: IMessage[]
      selectedFile: IMessage | null
}

interface ChatActions {
      setChats: (chats: IChat[]) => void
      addChat: (chat: IChat) => void
      removeChat: (chat: IChat) => void
      clearChats: () => void
      setSelectedChat: (chat: IChat | null) => void
      addNotification: (notification: IMessage) => void
      removeNotification: (notification: IMessage | undefined) => void
      updateChat: (latestMessage: IMessage) => void
      setSelectedFile: (file: IMessage | null) => void
      setChatOnTop: (message: IMessage) => void
}

export const useChat = create<ChatState & ChatActions>((set) => {
      const storedNotification = localStorage.getItem('notification')
      const initialNotification = storedNotification ? JSON.parse(storedNotification) : []

      return {
            // State
            chats: [],
            selectedChat: null,
            notification: initialNotification,
            selectedFile: null,

            // Chat Actions
            setChats: (chats) => set({ chats }),
            addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
            removeChat: (chat) => set((state) => ({ chats: state.chats.filter((c) => c._id !== chat._id) })),
            clearChats: () => set({ chats: [] }),
            setSelectedChat: (chat) => set({ selectedChat: chat }),
            setSelectedFile: (file) => set({ selectedFile: file }),
            updateChat: (latestMessage: IMessage) => {
                  set((state) => {
                        const chatIndex = state.chats.findIndex((chat) => chat._id === latestMessage.chat._id)
                        if (chatIndex !== -1) {
                              const updatedChats = [...state.chats]
                              updatedChats[chatIndex] = { ...updatedChats[chatIndex], latestMessage }
                              const chat = updatedChats.splice(chatIndex, 1)[0]
                              updatedChats.unshift(chat)
                              return { chats: updatedChats }
                        }
                        return state
                  })
            },
            setChatOnTop: (message: IMessage) => {
                  set((state) => {
                        const chatToUpdateIndex = state.chats.findIndex((chat) => chat._id === state.selectedChat?._id)

                        if (chatToUpdateIndex !== -1) {
                              const updatedChats = [...state.chats]
                              updatedChats[chatToUpdateIndex] = {
                                    ...updatedChats[chatToUpdateIndex],
                                    latestMessage: message,
                              }
                              return { chats: updatedChats }
                        }

                        return state
                  })
            },

            // Notification Actions
            addNotification: (newNotification) => {
                  set((state) => {
                        const currentNotification = state.notification
                        const existingChatIndex = currentNotification.findIndex((notificationItem) => notificationItem.chat._id === newNotification.chat._id)
                        let updatedNotification
                        if (existingChatIndex !== -1) {
                              updatedNotification = [...currentNotification]
                              updatedNotification[existingChatIndex].content = newNotification.content
                              updatedNotification[existingChatIndex].count += 1
                        } else {
                              updatedNotification = [...currentNotification, { ...newNotification, count: 1 }]
                        }

                        const chatToUpdate = state.chats.find((chat) => chat._id === newNotification.chat._id);
                        const updatedChatToUpdate = {
                              ...chatToUpdate,
                              latestMessage: {
                                    ...chatToUpdate?.latestMessage,
                                    content: newNotification.content,
                              },
                        };
                        const updatedChats = state.chats.map((chat) => (chat._id === chatToUpdate?._id ? updatedChatToUpdate : chat));
                        state.setChats(updatedChats as IChat[]);

                        localStorage.setItem('notification', JSON.stringify(updatedNotification))
                        return { notification: updatedNotification }
                  })
            },
            removeNotification: (notificationToRemove) => {
                  if (!notificationToRemove) return
                  set((state) => {
                        const currentNotification = state.notification
                        const updatedNotification = currentNotification.filter(
                              (notificationItem) => notificationItem.chat._id !== notificationToRemove?.chat._id
                        )
                        localStorage.setItem('notification', JSON.stringify(updatedNotification))
                        return { notification: updatedNotification }
                  })
            },
      }
})

export default useChat

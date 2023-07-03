import { create } from 'zustand'
import { IChat } from '../model/chat.model'
import { IMessage } from '../model/message.model'

interface ChatState {
      chats: IChat[]
      selectedChat: IChat | null
      notification: IMessage[]
      selectedChatCompare: IChat | null
}

interface ChatActions {
      setChats: (chats: IChat[]) => void
      addChat: (chat: IChat) => void
      removeChat: (chat: IChat) => void
      clearChats: () => void
      setSelectedChat: (chat: IChat | null) => void
      setNotification: (notification: IMessage) => void
      setSelectedChatCompare: (chat: IChat | null) => void
      removeNotification: (notification: IMessage) => void
}

export const useChat = create<ChatState & ChatActions>((set) => {
      const storedNotification = localStorage.getItem('notification')
      const initialNotification = storedNotification ? JSON.parse(storedNotification) : []

      return {
            // State
            chats: [],
            selectedChat: null,
            notification: initialNotification,
            
            // Chat
            setChats: (chats) => set({ chats }),
            addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
            removeChat: (chat) => set((state) => ({ chats: state.chats.filter((c) => c._id !== chat._id) })),
            clearChats: () => set({ chats: [] }),
            setSelectedChat: (chat) => set({ selectedChat: chat }),
            
            // For compare chat sockets
            selectedChatCompare: null,
            setSelectedChatCompare: (chat) => set({ selectedChatCompare: chat }),
            
            // Notification
            setNotification: (newNotification) => {
                  console.log('newNotification', newNotification)
                  set((state) => {
                        const currentNotification = state.notification
                        const existingChatIndex = currentNotification.findIndex(
                              (notificationItem) => notificationItem.chat._id === newNotification.chat._id
                        )
                        let updatedNotification
                        if (existingChatIndex !== -1) {
                              updatedNotification = [...currentNotification]
                              updatedNotification[existingChatIndex].count += 1
                        } else {
                              updatedNotification = [...currentNotification, { ...newNotification, count: 1 }]
                        }
                        localStorage.setItem('notification', JSON.stringify(updatedNotification))
                        return { notification: updatedNotification }
                  })
            },
            removeNotification: (notificationToRemove) => {
                  set((state) => {
                        const currentNotification = state.notification
                        const updatedNotification = currentNotification.filter(
                              (notificationItem) => notificationItem.chat._id !== notificationToRemove.chat._id
                        )
                        localStorage.setItem('notification', JSON.stringify(updatedNotification))
                        return { notification: updatedNotification }
                  })
            },
      }
})

export default useChat

import { create } from 'zustand'
import { IChat } from '../model/chat.model'


interface ChatState {
      chats: IChat[]
      setChats: (chats: IChat[]) => void
      addChat: (chat: IChat) => void
      removeChat: (chat: IChat) => void
      updateChat: (chat: IChat) => void
      clearChats: () => void
      selectedChat: IChat | null
      setSelectedChat: (chat: IChat | null) => void
}

export const useChat = create<ChatState>((set, get) => ({
      chats: [],
      setChats: (chats: IChat[]) => set({ chats }),
      addChat: (chat: IChat) => set({ chats: [...get().chats, chat] }),
      removeChat: (chat: IChat) => set({ chats: get().chats.filter(c => c._id !== chat._id) }),
      updateChat: (chat: IChat) => set({ chats: get().chats.map(c => c._id === chat._id ? chat : c) }),
      clearChats: () => set({ chats: [] }),
      selectedChat: null,
      setSelectedChat: (chat: IChat | null) => set({ selectedChat: chat })
}))

export default useChat
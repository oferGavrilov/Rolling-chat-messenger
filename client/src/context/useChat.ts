import { create } from 'zustand'
import { IChat } from '../model/chat.model'
import { IMessage, IReplyMessage } from '../model/message.model'

interface ChatState {
      chats: IChat[]
      selectedChat: IChat | null
      notification: IMessage[]
      selectedFile: IMessage | null
      replyMessage: IReplyMessage | null
}

interface ChatActions {
      setChats: (chats: IChat[] | ((currentChats: IChat[]) => IChat[])) => void;
      addChat: (chat: IChat) => void
      removeChat: (chat: IChat) => void
      updateChatWithLatestMessage: (latestMessage: IMessage) => void
      setSelectedChat: (chat: IChat | null) => void
      setSelectedFile: (file: IMessage | null) => void
      setReplyMessage: (message: IReplyMessage | null) => void
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
            replyMessage: null,

            // Chat Actions
            setChats: (chatsOrUpdater: IChat[] | ((currentChats: IChat[]) => IChat[])) => {
                  set((state) => {
                        const newChats = typeof chatsOrUpdater === 'function'
                              ? chatsOrUpdater(state.chats)
                              : chatsOrUpdater;
                        return { ...state, chats: newChats };
                  });
            },
            addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
            removeChat: (chat) => set((state) => ({ chats: state.chats.filter((c) => c._id !== chat._id) })),
            setSelectedChat: (chat) => set({ selectedChat: chat }),
            setSelectedFile: (file) => set({ selectedFile: file }),
            setReplyMessage: (message) => set({ replyMessage: message }),
            updateChatWithLatestMessage: (latestMessage: IMessage) => {
                  set((state) => {
                        const chatIndex = state.chats.findIndex(chat => chat._id === latestMessage.chat?._id);
                        console.log(chatIndex)
                        if (chatIndex === -1) {
                              return state;
                        }
                        const updatedChat = { ...state.chats[chatIndex], latestMessage };

                        const updatedChats = [
                              updatedChat,
                              ...state.chats.slice(0, chatIndex),
                              ...state.chats.slice(chatIndex + 1)
                        ];

                        return { ...state, chats: updatedChats };
                  });
            },
      }
})

export default useChat

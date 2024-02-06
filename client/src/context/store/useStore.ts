import { create } from 'zustand'

import { createChatSlice } from './chatStore'
import { createFileSlice } from './fileStore'


type Store = ReturnType<typeof createChatSlice> & ReturnType<typeof createFileSlice>

const useStore = create<Store>((set, get) => {
      return {
            ...createChatSlice(set, get),
            ...createFileSlice(set)
      }
}
)

export default useStore


// import { IChat } from '../model/chat.model'
// import { IMessage, IReplyMessage } from '../model/message.model'
// import { IUser } from '../model'

// interface ChatState {
//       chats: IChat[]
//       messages: IMessage[]
//       selectedChat: IChat | null
//       replyMessage: IReplyMessage | null
//       selectedFile: IMessage | null
//       selectedImage: string | null
// }

// interface ChatActions {
//       setChats: (chats: IChat[] | ((currentChats: IChat[]) => IChat[])) => void;
//       setMessages: (messages: IMessage[] | ((currentMessages: IMessage[]) => IMessage[])) => void;
//       updateChatWithLatestMessage: (latestMessage: IMessage) => void
//       setSelectedChat: (chat: IChat | null) => void
//       setReplyMessage: (message: IReplyMessage | null) => void
//       removeMessage: (messageId: string, chatId: string, removerId: string) => void
//       updateChatReadReceipts: (chatId: string, userId: string) => void;
//       bringChatToTop: (message: IMessage) => void
//       updateChatsWithNewMessage: (newMessage: IMessage) => void
//       onSelectChat: (user: IUser, loggedInUser?: IUser) => Promise<void>
//       setSelectedFile: (file: IMessage | null) => void
//       setSelectedImage: (file: string | null) => void
// }

// export const useChat = create<ChatState & ChatActions>((set, get) => {

//       return {
//             // State
//             chats: [],
//             messages: [],
//             selectedChat: null,
//             replyMessage: null,
//             selectedFile: null,
//             selectedImage: null,

//             // Chat Actions
//             setChats: (chatsOrUpdater: IChat[] | ((currentChats: IChat[]) => IChat[])) => {
//                   set((state) => {
//                         const newChats = typeof chatsOrUpdater === 'function'
//                               ? chatsOrUpdater(state.chats)
//                               : chatsOrUpdater;
//                         return { ...state, chats: newChats };
//                   });
//             },
//             setSelectedChat: (chat) => set({ selectedChat: chat }),
//             setSelectedFile: (file) => set({ selectedFile: file }),
//             setSelectedImage: (image) => set({ selectedImage: image }),
//             setReplyMessage: (message) => set({ replyMessage: message }),
//             updateChatWithLatestMessage: (latestMessage: IMessage) => {
//                   set((state) => {
//                         const chatIndex = state.chats.findIndex(chat => chat._id === latestMessage.chat?._id);
//                         console.log(chatIndex)
//                         if (chatIndex === -1) {
//                               return state;
//                         }
//                         const updatedChat = { ...state.chats[chatIndex], latestMessage };

//                         const updatedChats = [
//                               updatedChat,
//                               ...state.chats.slice(0, chatIndex),
//                               ...state.chats.slice(chatIndex + 1)
//                         ];

//                         return { ...state, chats: updatedChats };
//                   });
//             },
//             updateChatReadReceipts: (chatId: string, userId: string) => {
//                   set((state) => {
//                         const updatedChats = state.chats.map(chat => {
//                               if (chat._id === chatId && chat.latestMessage) {
//                                     const alreadyReadByUser = chat.latestMessage.isReadBy.some(readReceipt => readReceipt.userId === userId);
//                                     let updatedReadBy = chat.latestMessage.isReadBy;

//                                     if (!alreadyReadByUser) {
//                                           updatedReadBy = [...updatedReadBy, { userId, readAt: new Date() }];
//                                     }

//                                     const updatedChat: IChat = {
//                                           ...chat,
//                                           unreadMessagesCount: 0,
//                                           latestMessage: {
//                                                 ...chat.latestMessage,
//                                                 isReadBy: updatedReadBy
//                                           }
//                                     };

//                                     return updatedChat;
//                               }
//                               return chat;
//                         });

//                         return { ...state, chats: updatedChats };
//                   });
//             },
//             setMessages: (messagesOrUpdater: IMessage[] | ((currentMessages: IMessage[]) => IMessage[])) => {
//                   set((state) => {
//                         const newMessages = typeof messagesOrUpdater === 'function'
//                               ? messagesOrUpdater(state.messages)
//                               : messagesOrUpdater;
//                         return { ...state, messages: newMessages };
//                   });
//             },
//             removeMessage: (messageId: string, chatId: string, removerId: string) => {
//                   set((state) => {
//                         // Update messages
//                         const updatedMessages = state.messages.map(msg =>
//                               msg._id === messageId
//                                     ? { ...msg, deletedBy: [...msg.deletedBy, removerId] }
//                                     : msg
//                         );

//                         // Update chats
//                         const updatedChats = state.chats.map(chat =>
//                               chat._id === chatId && chat.latestMessage?._id === messageId
//                                     ? {
//                                           ...chat,
//                                           latestMessage: { ...chat.latestMessage, deletedBy: [...chat.latestMessage.deletedBy, removerId] }
//                                     }
//                                     : chat
//                         );

//                         return { ...state, chats: updatedChats, messages: updatedMessages };
//                   });
//             },
//             bringChatToTop: (message: IMessage) => {
//                   set((state) => {
//                         const chatIndex = state.chats.findIndex(chat => chat._id === message.chatId);
//                         if (chatIndex === -1) return state;

//                         const updatedChats = [...state.chats];
//                         const updatedChat = { ...updatedChats[chatIndex], latestMessage: message };
//                         updatedChats.splice(chatIndex, 1);
//                         updatedChats.unshift(updatedChat);

//                         return { ...state, chats: updatedChats };
//                   });
//             },
//             updateChatsWithNewMessage: (newMessage: IMessage) => {
//                   set((state) => {
//                         let updatedChats = [...state.chats];
//                         const chatIndex = updatedChats.findIndex(chat => chat._id === newMessage.chat?._id);

//                         if (chatIndex !== -1) {
//                               // Chat exists, update it
//                               const updatedChat = { ...updatedChats[chatIndex] };
//                               updatedChat.latestMessage = newMessage;
//                               updatedChat.unreadMessagesCount = (updatedChat.unreadMessagesCount || 0) + 1;
//                               updatedChats[chatIndex] = updatedChat;
//                         } else if (newMessage.chat) {
//                               // New chat from the message, add it to the start
//                               newMessage.chat.unreadMessagesCount = 1;
//                               newMessage.chat.latestMessage = newMessage;
//                               updatedChats.unshift(newMessage.chat);
//                         }

//                         return { ...state, chats: updatedChats };
//                   });
//             },
//             onSelectChat: async (user: IUser, loggedInUser?: IUser) => {
//                   if (!loggedInUser) return;

//                   const { chats } = get();
//                   let chat = chats.find((chat: IChat) => !chat.isGroupChat && chat.users.some(chatUser => chatUser._id === user._id));

//                   if (chat) {
//                         set({ selectedChat: chat });
//                         return;
//                   }

//                   const newChat: IChat = {
//                         _id: 'temp-id', // Temporary ID until it's confirmed by the backend
//                         chatName: user.username,
//                         isGroupChat: false,
//                         users: [user, loggedInUser],
//                         kickedUsers: [],
//                         unreadMessagesCount: 0,
//                   };

//                   set({ selectedChat: newChat });
//             },
//       }
// })

// export default useChat
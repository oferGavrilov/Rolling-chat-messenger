import { IChat, IMessage, IReplyMessage, IUser } from '../../model'; // Adjust import paths as needed

interface ChatState {
    chats: IChat[]
    messages: IMessage[]
    selectedChat: IChat | null
    replyMessage: IReplyMessage | null
}

interface ChatActions {
    setChats: (chats: IChat[] | ((currentChats: IChat[]) => IChat[])) => void;
    setMessages: (messages: IMessage[] | ((currentMessages: IMessage[]) => IMessage[])) => void;
    updateChatWithLatestMessage: (latestMessage: IMessage) => void
    setSelectedChat: (chat: IChat | null) => void
    setReplyMessage: (message: IReplyMessage | null) => void
    removeMessage: (messageId: string, chatId: string, removerId: string, deleteAction: 'forMe' | 'forEveryone') => void
    updateChatReadReceipts: (chatId: string, userId: string) => string[];
    bringChatToTop: (message: IMessage) => void
    updateChatsWithNewMessage: (newMessage: IMessage) => void
    onSelectChat: (user: IUser, loggedInUser?: IUser) => Promise<void>
    updateChatStatusToRead: (chatId: string, userId: string) => void
}

export type IChatStore = ChatState & ChatActions;

export const createChatSlice = (set, get): IChatStore => ({
    chats: [],
    messages: [],
    selectedChat: null,
    replyMessage: null,

    setChats: (chatsOrUpdater: IChat[] | ((currentChats: IChat[]) => IChat[])) => {
        set((state: ChatState) => {
            const newChats = typeof chatsOrUpdater === 'function'
                ? chatsOrUpdater(state.chats)
                : chatsOrUpdater;
            return { ...state, chats: newChats };
        });
    },
    setSelectedChat: (chat: IChat | null) => set({ selectedChat: chat }),
    setReplyMessage: (message: IReplyMessage | null) => set({ replyMessage: message }),

    updateChatWithLatestMessage: (latestMessage: IMessage) => {
        set((state: ChatState) => {
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
    updateChatReadReceipts: (chatId: string, userId: string): string[] => {
        let updatedMessageIds: string[] = [];

        set((state: ChatState) => {
            const updatedChats = state.chats.map(chat => {
                if (chat._id === chatId && chat.latestMessage) {
                    const alreadyReadByUser = chat.latestMessage.isReadBy.some(readReceipt => readReceipt.userId === userId);
                    let updatedReadBy = chat.latestMessage.isReadBy;

                    if (!alreadyReadByUser) {
                        updatedMessageIds.push(chat.latestMessage._id);

                        updatedReadBy = [...updatedReadBy, { userId, readAt: new Date() }];
                    }

                    const updatedChat: IChat = {
                        ...chat,
                        unreadMessagesCount: 0,
                        latestMessage: {
                            ...chat.latestMessage,
                            isReadBy: updatedReadBy
                        }
                    };

                    return updatedChat;
                }
                return chat;
            });

            return { ...state, chats: updatedChats };
        });

        return updatedMessageIds;
    },
    setMessages: (messagesOrUpdater: IMessage[] | ((currentMessages: IMessage[]) => IMessage[])) => {
        set((state: ChatState) => {
            const newMessages = typeof messagesOrUpdater === 'function'
                ? messagesOrUpdater(state.messages)
                : messagesOrUpdater;
            return { ...state, messages: newMessages };
        });
    },
    removeMessage: (messageId: string, chatId: string, removerId: string, deletionType: 'forMe' | 'forEveryone') => {
        set((state: ChatState) => {
            const deletionObject = { userId: removerId, deletionType };

            // Update messages with the correct deletion object
            const updatedMessages = state.messages.map(msg =>
                msg._id === messageId
                    ? { ...msg, deletedBy: [...msg.deletedBy, deletionObject] }
                    : msg
            );
            // Update latestMessage in chats with the correct deletion object
            const updatedChats = state.chats.map(chat =>
                chat._id === chatId && chat.latestMessage?._id === messageId
                    ? {
                        ...chat,
                        latestMessage: {
                            ...chat.latestMessage,
                            deletedBy: [...chat.latestMessage.deletedBy, deletionObject]
                        }
                    }
                    : chat
            );

            return { ...state, chats: updatedChats, messages: updatedMessages };
        });
    },
    bringChatToTop: (message: IMessage) => {
        set((state: ChatState) => {
            const chatIndex = state.chats.findIndex(chat => chat._id === message.chatId);
            if (chatIndex === -1) return state;

            const updatedChats = [...state.chats];
            const updatedChat = { ...updatedChats[chatIndex], latestMessage: message };
            updatedChats.splice(chatIndex, 1);
            updatedChats.unshift(updatedChat);

            return { ...state, chats: updatedChats };
        });
    },
    updateChatsWithNewMessage: (newMessage: IMessage) => {
        set((state: ChatState) => {
            let updatedChats = [...state.chats];
            const chatIndex = updatedChats.findIndex(chat => chat._id === newMessage.chat?._id);

            if (chatIndex !== -1) {
                // Chat exists, update it
                const updatedChat = { ...updatedChats[chatIndex] };
                updatedChat.latestMessage = newMessage;
                updatedChat.unreadMessagesCount = (updatedChat.unreadMessagesCount || 0) + 1;
                updatedChats[chatIndex] = updatedChat;
            } else if (newMessage.chat) {
                // New chat from the message, add it to the start
                newMessage.chat.unreadMessagesCount = 1;
                newMessage.chat.latestMessage = newMessage;
                updatedChats.unshift(newMessage.chat);
            }

            return { ...state, chats: updatedChats };
        });
    },
    onSelectChat: async (user: IUser, loggedInUser?: IUser) => {
        if (!loggedInUser) return;

        const { chats } = get();
        let chat = chats.find((chat: IChat) => !chat.isGroupChat && chat.users.some(chatUser => chatUser._id === user._id));

        if (chat) {
            set({ selectedChat: chat });
            return;
        }

        const newChat: IChat = {
            _id: 'temp-id', // Temporary ID until it's confirmed by the server 
            chatName: user.username,
            isGroupChat: false,
            users: [user, loggedInUser],
            kickedUsers: [],
            unreadMessagesCount: 0,
            isNewChat: true
        };

        set({ selectedChat: newChat });
    },
    updateChatStatusToRead: (chatId: string, userId: string) => {
        set((state: ChatState) => {
            const updatedChats = state.chats.map(chat => {
                if (chat._id === chatId && chat.latestMessage) {
                    let isReadByUpdated = chat.latestMessage.isReadBy;
    
                    // Check if the user has already read this message
                    const userReadReceiptIndex = isReadByUpdated.findIndex(receipt => receipt.userId === userId);
    
                    if (userReadReceiptIndex !== -1) {
                        // Update existing read receipt
                        isReadByUpdated[userReadReceiptIndex] = { ...isReadByUpdated[userReadReceiptIndex], readAt: new Date() };
                    } else {
                        // Add new read receipt
                        isReadByUpdated.push({ userId, readAt: new Date() });
                    }
    
                    const updatedChat: IChat = {
                        ...chat,
                        unreadMessagesCount: 0,
                        latestMessage: {
                            ...chat.latestMessage,
                            isReadBy: isReadByUpdated
                        }
                    };
    
                    return updatedChat;
                }
                return chat;
            });
    
            return { ...state, chats: updatedChats };
        });
    }
    
});

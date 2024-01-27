import React from 'react'
import { IMessage, IChat, IUser } from '../../../model'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { Image, Audiotrack, Description } from '@mui/icons-material'

interface ChatMessagePreviewProps {
    chat: IChat
    loggedinUser: IUser
    unreadMessagesCount: number
    selectedChat: IChat | null
}

const LatestMessageContent: React.FC<{ message: IMessage }> = ({ message }) => {
    if (message.deletedBy?.includes(message.sender._id)) {
        return (
            <div className="text-base flex items-center gap-x-1 text-gray-400 font-thin">
                <NotInterestedIcon className='!text-base' />
                This message was deleted
            </div>
        )
    }

    const messageTypeToContent = {
        text: () => <>{message.content}</>,
        image: () => <>Image <Image fontSize="small" className='content-preview' /></>,
        audio: () => <>Audio <Audiotrack fontSize="small" className='content-preview' /></>,
        file: () => <>File <Description fontSize="small" className='content-preview' /></>,
    }

    return <div className='ellipsis-text text-md max-w-[182px]'>
        {messageTypeToContent[message.messageType]?.()}
    </div>
}

const LatestMessagePreview: React.FC<ChatMessagePreviewProps> = React.memo(({ chat, loggedinUser, unreadMessagesCount, selectedChat }) => {
    const latestMessage = chat.latestMessage;
    if (!latestMessage) return null;

    const isSender = latestMessage.sender?._id === loggedinUser?._id;
    const isReadByOtherUser = latestMessage.isReadBy?.some(user => user.userId !== loggedinUser?._id);
    let senderPrefix = '';
    if (isSender) {
        senderPrefix = 'You: ';
    } else if (chat.isGroupChat) {
        senderPrefix = `${latestMessage.sender?.username}: `;
    }

    function isShowUnreadMessagesCount() {
        return !isSender && unreadMessagesCount > 0 && selectedChat?._id !== chat._id;
    }

    return (
        <div className='flex justify-between items-center w-full'>
            <div className={`text-base h-6 max-h-[24px] flex items-center ${!isSender && selectedChat?._id !== chat._id ? 'text-primary font-semibold' : 'text-[#00000085] dark:text-dark-primary-text'}`}>
                <span className={`max-w-[260px] ${isSender && 'mr-2'}`}>{senderPrefix}</span>
                <LatestMessageContent message={latestMessage} />
            </div>
            {isShowUnreadMessagesCount() && (
                <div className='text-xs text-white bg-primary rounded-full h-5 w-5 flex justify-center items-center'>
                    {unreadMessagesCount}
                </div>
            )}
            {isSender && (
                <DoneAllIcon className={`!text-base ${isReadByOtherUser ? 'text-blue-500' : ''}`} />
            )}
        </div>
    );
});


export default LatestMessagePreview

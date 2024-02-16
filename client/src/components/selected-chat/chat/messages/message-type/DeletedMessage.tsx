import NotInterestedIcon from '@mui/icons-material/NotInterested'

interface Props {
    isUnknownUser?: boolean
}

export default function DeletedMessage({isUnknownUser}: Props) : JSX.Element{
    return (
        <div className={`text-gray-100 dark:text-gray-400 py-2 px-4 flex items-center gap-x-1 w-max rounded-lg ${isUnknownUser ? 'bg-dark-incoming-chat-bg' : ''}`}>
            <NotInterestedIcon className="!text-sm !text-gray-200" />
            <span className="text-xs">This message was deleted</span>
        </div>
    )
}

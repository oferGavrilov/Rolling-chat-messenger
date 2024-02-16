import { IMessage } from "../../../../model"
import { formatMessageSentDate, hasDayPassed } from "../../../../utils/functions"

interface IMessageDateSeparator {
    prevMessage: IMessage
    currMessage: IMessage
    idx: number
}

function getFormattedDateIfDayPassed(prevMessage: IMessage, currMessage: IMessage, idx: number): string {
    if (idx === 0) {
        return formatMessageSentDate(currMessage.createdAt)
    }

    if (hasDayPassed(prevMessage.createdAt, currMessage.createdAt)) {
        return formatMessageSentDate(currMessage.createdAt)
    }

    return ''
}

const MessageDateSeparator: React.FC<IMessageDateSeparator> = ({ prevMessage, currMessage, idx }): JSX.Element | null => {
    const formattedDate = getFormattedDateIfDayPassed(prevMessage, currMessage, idx)
    if (!formattedDate) return null

    return (
        <div className="w-max mx-auto">
            <div className="bg-gray-400 text-white text-sm px-2 rounded-full select-none">
                <span>{formattedDate}</span>
            </div>
        </div>
    )
}

export default MessageDateSeparator
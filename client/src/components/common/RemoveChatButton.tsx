import { MdDelete } from "react-icons/md"

interface Props {
      onRemoveChat: () => void
}

export default function RemoveChatButton ({ onRemoveChat }: Props): JSX.Element {
      return (
            <div>
                  <div className="py-2 text-red-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg" onClick={onRemoveChat}>
                        <div className="px-6 flex gap-x-2 items-center">
                              <MdDelete size={22} />
                              <span>Remove chat</span>
                        </div>
                  </div>
            </div>
      )
}

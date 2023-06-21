import { useChat } from '../../../store/useChat'
import { IChat } from '../../../model/chat.model'
import { getLoggedinUser } from '../../../helpers/config'
import { User } from '../../../model/user.model'

export default function MessagePreview ({ chat }: { chat: IChat }) {
      const { setSelectedChat, selectedChat } = useChat()

      function getSender (users: User[]): User {
            const loggedinUser = getLoggedinUser()
            return users.find(currUser => currUser._id !== loggedinUser?._id) || users[0]
      }
      return (
            <li onClick={() => setSelectedChat(chat)}
                  className={`flex items-center rounded-lg justify-between px-3 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200
                   ${selectedChat?._id === chat._id && 'bg-gray-100'}`}>
                  <div className="flex items-center">
                        <img src={getSender(chat.users)?.profileImg} alt="user-image" className="h-11 w-11 rounded-full object-cover" />
                        <div className="ml-3">
                              <h3 className="text-lg font-sf-regular font-bold">{getSender(chat.users)?.username}</h3>
                              <p className="text-sm font-sf-regular text-[#00000085]">Hey, how are you?</p>
                        </div>
                  </div>
                  <div className="text-sm font-sf-regular text-[#00000085]">1h</div>
            </li>
      )
}
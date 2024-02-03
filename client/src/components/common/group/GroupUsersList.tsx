import DeleteIcon from '@mui/icons-material/Delete'
import { chatService } from '../../../services/chat.service'
import socketService from '../../../services/socket.service'
import { IChat } from '../../../model/chat.model'
import { IUser } from '../../../model/user.model'
import useStore from '../../../context/store/useStore'

interface Props {
      selectedChat: IChat | null
      setSelectedChat: (chat: IChat | null) => void
      loggedInUser: IUser | null
      isAdmin: (chat: IChat, userId: string) => boolean
}

export default function GroupUsersList({ selectedChat, setSelectedChat, loggedInUser, isAdmin }: Props): JSX.Element {

      const { onSelectChat } = useStore()
      async function onKickFromGroup(userId: string) {
            if (!selectedChat || !loggedInUser) return
            try {
                  const updatedChat = await chatService.kickFromGroup(selectedChat._id, userId, loggedInUser._id)

                  socketService.emit('kick-from-group', { chatId: selectedChat._id, userId, kickerId: loggedInUser._id })

                  setSelectedChat({ ...selectedChat, users: updatedChat.users })
            } catch (err) {
                  console.log(err)
            }
      }

      function onNavigateToUser(userToChat: IUser) {
            if (loggedInUser && loggedInUser?._id === userToChat._id) return

            onSelectChat(userToChat, loggedInUser as IUser)
      }

      if (!selectedChat || !loggedInUser) return <div></div>
      return (
            <div className="flex flex-col gap-y-2 border-2 dark:border-dark-primary-bg rounded-lg">
                  {selectedChat.users.map(user => (
                        <div key={user._id} className="flex justify-between">
                              <div className="flex items-center justify-between gap-x-3 border-b-2 last:border-b-0 py-2 hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg w-full p-2  cursor-pointer rounded-lg" onClick={() => onNavigateToUser(user)}>
                                    <div className="flex items-center gap-x-3">
                                          <img src={user.profileImg} className="w-10 h-10 rounded-full object-cover" alt="profile" />
                                          <span className="text-lg">{user.username}</span>
                                    </div>
                                    {isAdmin(selectedChat, user._id) && (
                                          <span className="bg-slate-300 dark:bg-dark-primary-bg text-white px-2 py-[1px] rounded-md text-sm">
                                                Admin
                                          </span>
                                    )}
                                    {(isAdmin(selectedChat, loggedInUser._id) && user._id !== loggedInUser._id) &&
                                          <div className="flex justify-end text-red-600 transition-transform duration-200 hover:scale-125" onClick={() => onKickFromGroup(user._id)}>
                                                <DeleteIcon className="!text-2xl" />
                                          </div>
                                    }
                              </div>
                        </div>
                  ))}
            </div>
      )
}

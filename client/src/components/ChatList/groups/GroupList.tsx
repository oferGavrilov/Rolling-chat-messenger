import { IChat } from '../../../model/chat.model'
import useChat from '../../../store/useChat'

interface Props {
      groups: IChat[]
}

export default function GroupList ({ groups }: Props) {
      const { selectedChat, setSelectedChat } = useChat()

      return (
            <ul className='py-8'>
                  {groups.map(group => (
                        <li key={group._id} onClick={() => setSelectedChat(group)} className={`flex items-center p-2 rounded-lg cursor-pointer space-x-3 mb-4 hover:bg-gray-100 ${selectedChat?._id === group._id && 'bg-gray-100'}`}>
                              <img className='w-12 h-12 rounded-full object-cover object-top' src={group.groupImage} alt="" />
                              <div className='flex flex-col'>
                                    <h3 className='font-sf-regular font-bold text-lg'>{group.chatName}</h3>
                                    <p className='text-gray-500 text-sm'>Last message</p>
                              </div>
                        </li>
                  ))}
            </ul>
      )
}

import { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { AiOutlineArrowDown } from 'react-icons/ai'
import { MdKeyboardArrowDown } from 'react-icons/md'
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined'
import { chatService } from '../../services/chat.service'
import { IChat } from '../../model/chat.model'
import { userService } from '../../services/user.service'
import { User } from '../../model/user.model'
import { getLoggedinUser } from '../../helpers/config'
import { ChatState } from '../../context/ChatProvider'
import Loading from '../Loading'


interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Messages ({ setShowSearch }: Props) {
      const [search, setSearch] = useState<string>('')
      const [chats, setChats] = useState<IChat[]>([])
      const [isLoading, setIsLoading] = useState<boolean>(false)

      const { selectedChat, setSelectedChat } = ChatState()

      useEffect(() => {
            loadChats()
      }, [])

      async function loadChats (): Promise<void> {
            setIsLoading(true)
            const user = userService.getLoggedinUser()
            const chats = await chatService.getUserChats(user._id)
            setChats(chats)
            setIsLoading(false)
      }

      function getSender (users: User[]): User {
            const loggedinUser = getLoggedinUser()
            return users.find(currUser => currUser._id !== loggedinUser?._id) || users[0]
      }
      return (
            <div className="pt-7 relative">
                  <div className="mx-4">

                        <div className='flex justify-between items-center pb-4'>
                              <h2 className="text-3xl font-sf-regular font-bold ">Messages</h2>
                              <div onClick={() => setShowSearch(true)} className='hover:text-blue-500 hover:bg-gray-200 p-2 text-gray-400 flex items-center justify-center rounded-xl transition-colors duration-200 cursor-pointer'>
                                    <PersonSearchOutlinedIcon />
                              </div>
                        </div>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search"
                              className="bg-[#f4f2f2] h-10 w-full px-12 rounded-xl text-lg placeholder:text-lg border-2 border-gray-100 focus:border-blue-400 focus-visible:outline-none" />
                        <BsSearch size={16} className="absolute top-[6rem] left-8  text-[#00000085]" />

                        <AiOutlineArrowDown
                              onClick={() => setSearch('')}
                              size={20}
                              className={`absolute top-[6rem] right-7 text-primary opacity-0 pointer-events-none cursor-pointer ${search ? 'custom-rotate pointer-events-auto opa' : 'reverse-rotate'}`} />

                        <div className='p-3 flex'>
                              Sort by
                              <div className='text-[#2D9CDB] px-2 flex items-center cursor-pointer hover:underline'>
                                    Newest
                                    <MdKeyboardArrowDown size={20} className="mt-1" />
                              </div>
                        </div>
                  </div>
                  <div className="overflow-y-auto h-[82vh]">

                  {!isLoading ? (chats.map((chat: IChat) => (
                        <ul>
                              <li key={chat._id} onClick={() => setSelectedChat(chat)} 
                              className={`flex items-center rounded-lg justify-between px-3 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${selectedChat?._id === chat._id && 'bg-gray-100'}`}>
                                    <div className="flex items-center">
                                          <img src={getSender(chat.users)?.profileImg} alt="user-image" className="h-11 w-11 rounded-full object-cover" />
                                          <div className="ml-3">
                                                <h3 className="text-lg font-sf-regular font-bold">{getSender(chat.users)?.username}</h3>
                                                <p className="text-sm font-sf-regular text-[#00000085]">Hey, how are you?</p>
                                          </div>
                                    </div>
                                    <div className="text-sm font-sf-regular text-[#00000085]">1h</div>
                              </li>
                        </ul>
                  ))) : (<Loading type="messages" />)}
                  </div>
            </div>
      )
}

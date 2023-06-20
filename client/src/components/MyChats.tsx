import AddIcon from '@mui/icons-material/Add';
import { ChatState } from '../context/ChatProvider';
import { useEffect, useState } from 'react';
import { chatService } from '../services/chat.service';
import { User } from '../model/user.model';
import { getLoggedinUser } from '../helpers/config';


export default function MyChats () {
      const { selectedChat, setSelectedChat, chats, setChats } = ChatState()
      const [isLoading, setIsLoading] = useState<boolean>(false)

      useEffect(() => {
            loadChats()
      }, [])
      console.log(chats)

      async function loadChats () {
            setIsLoading(true)
            const loggedinUser = getLoggedinUser()
            const data = await chatService.getUserChats(loggedinUser?._id as string)
            console.log(data)
            setChats(data)
            setIsLoading(false)
      }

      function getSender (users: User[]): string {
            if(!users) return 'Loading...'
            const loggedinUser = getLoggedinUser()
            return users.find(currUser => currUser._id !== loggedinUser?._id)?.username as string
      }

      return (
            <div className="bg-white  min-w-[400px] rounded-lg  shadow-2xl shadow-tertiary slide-right">
                  <div className="flex justify-between items-center p-5">
                        <h2 className="text-[1.2rem]  text-[#6a6868]">My Chats</h2>
                        <div className="flex items-center gap-x-2 py-2 px-2 bg-quaternary rounded-lg custom-hover">
                              <span>New Group Chat</span>
                              <AddIcon />
                        </div>
                  </div>
                  {!isLoading ? (<ul className="my-2 px-4 mr-1 overflow-y-auto h-5/6 flex flex-col gap-y-3">
                        {chats.map((chat) => (
                              <li key={chat._id} onClick={() => setSelectedChat(chat)} className={`bg-[#E0F2F1] px-2 py-4 rounded-md custom-hover ${selectedChat?._id === chat._id && 'bg-primary text-white'}`}>
                                    <span>{chat.isGroupChat ? chat.chatName : getSender(chat.users)}</span>
                              </li>
                        ))}
                  </ul>) : (<div>Loading...</div>)}
            </div>)
}

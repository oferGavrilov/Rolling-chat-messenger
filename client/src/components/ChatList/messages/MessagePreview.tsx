import { useChat } from '../../../store/useChat'
import { IChat } from '../../../model/chat.model'
import { getLoggedinUser } from '../../../helpers/config'
import { User } from '../../../model/user.model'
import { useCallback } from 'react'
import { Avatar, Badge } from '@mui/material'
import { styled } from '@mui/system'

export default function MessagePreview ({ chat }: { chat: IChat }) {
      const { setSelectedChat, selectedChat } = useChat()

      const getSender = useCallback(
            (users: User[]): User => {
                  const loggedinUser = getLoggedinUser()
                  return users.find((currUser) => currUser._id !== loggedinUser?._id) || users[0]
            },
            []
      )


      const StyledBadge = styled(Badge)(() => ({
            '& .MuiBadge-badge': {
                  backgroundColor: '#44b700',
                  color: '#44b700',
                  boxShadow: `0 0 0 2px lightgreen`,
                  '&::after': {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        animation: 'ripple 1.2s infinite ease-in-out',
                        border: '1px solid currentColor',
                        content: '""',
                  },
            },
            '@keyframes ripple': {
                  '0%': {
                        transform: 'scale(.8)',
                        opacity: 1,
                  },
                  '100%': {
                        transform: 'scale(2.4)',
                        opacity: 0,
                  },
            },
      }))
      return (
            <li onClick={() => setSelectedChat(chat)}
                  className={`flex items-center rounded-lg justify-between px-3 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200
                   ${selectedChat?._id === chat._id && 'bg-gray-100'}`}>
                  <div className="flex items-center">
                        {!chat.isGroupChat ? (
                              <StyledBadge overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot">
                                    <Avatar alt='' src={chat.isGroupChat ? chat.groupImage : getSender(chat.users)?.profileImg} />
                              </StyledBadge>) : (
                              <Avatar alt='' src={chat.isGroupChat ? chat.groupImage : getSender(chat.users)?.profileImg} />
                        )}

                        <div className="ml-3">
                              <h3 className="text-lg  font-bold">{chat.isGroupChat ? chat.chatName : getSender(chat.users)?.username}</h3>
                              <p className="text-sm  text-[#00000085]">Hey, how are you?</p>
                        </div>
                  </div>
                  <div className="text-sm  text-[#00000085]">1h</div>
            </li>
      )
}

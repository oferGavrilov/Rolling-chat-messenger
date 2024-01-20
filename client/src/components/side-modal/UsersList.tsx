import { IUser } from '../../model/user.model'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface Props {
      users: IUser[]
      onSelectChat: (user: IUser) => void
      usersType: "group" | "message"
      selectedUsers?: IUser[]
      clearSelectedUsers?: () => void
}

export default function UsersList ({ users, onSelectChat, usersType, selectedUsers, clearSelectedUsers }: Props): JSX.Element {
      return (
            <div className={`${usersType === 'group' ? 'h-[calc(100svh-416px)] mt-6 md:h-[calc(100svh-476px)]' : 'h-[calc(100svh-148px)] md:h-[calc(100svh-156px)]'} overflow-y-auto`}>
                  <ul className='flex flex-col'>
                        {users.map((user: IUser) => (
                              <li
                                    key={user._id}
                                    className={`user-card ${selectedUsers?.some(selectedUser => selectedUser._id === user._id) ? '!bg-primary text-white' : ''}`}
                                    onClick={() => onSelectChat(user)}
                              >
                                    <div className='flex gap-x-4 items-center'>
                                          <img className='w-10 h-10 md:w-12 md:h-12 object-cover object-top rounded-full' src={user.profileImg || "imgs/guest.jpg"} alt="" />
                                          <div>
                                                <span className='md:text-xl font-semibold'>{user.username}</span>
                                                <p className='ellipsis-text text-lg max-w-[270px]'>
                                                      <span className='font-bold'>Email: </span>
                                                      {user.email}</p>
                                          </div>
                                    </div>
                              </li>
                        ))}

                        {(selectedUsers && selectedUsers?.length > 0) && (
                              <div
                                    className='absolute bottom-5 right-5 bg-gray-200 shadow-xl shadow-gray-400 dark:bg-dark-dropdown-bg rounded-full p-4 cursor-pointer'
                                    onClick={clearSelectedUsers}
                              >
                                    <DeleteForeverIcon className='text-red-500' />
                              </div>
                        )}
                  </ul>
            </div>
      )
}

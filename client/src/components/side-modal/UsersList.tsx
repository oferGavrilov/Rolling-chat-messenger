import { IUser } from '../../model/user.model'

interface Props {
      users: IUser[]
      onSelectChat: (user: IUser) => void
      usersType: "group" | "message"
      selectedUsers?: string[]
      clearSelectedUsers?: () => void
}

export default function UsersList({ users, onSelectChat, usersType, selectedUsers, clearSelectedUsers }: Props): JSX.Element {
      if (!users || users.length === 0) {
            return (
                  <div className="text-center py-4">
                        <p>No users available.</p>
                  </div>
            );
      }

      return (
            <div className={`${usersType === 'group' ? 'h-[calc(100svh-416px)] mt-6 md:h-[calc(100svh-476px)]' : 'h-[calc(100svh-148px)] md:h-[calc(100svh-156px)]'} overflow-y-auto`}>
                  <ul className='flex flex-col m-3'>
                        {users?.map((user: IUser) => (
                              <li
                                    key={user._id}
                                    className={`user-card ${selectedUsers?.some(selectedUserId => selectedUserId === user._id) ? '!bg-primary text-white' : ''}`}
                                    onClick={() => onSelectChat(user)}
                              >
                                    <div className='flex gap-x-4 items-center'>
                                          <img className='w-10 h-10 md:w-12 md:h-12 object-cover rounded-full' src={user.profileImg || "imgs/guest.jpg"} alt="" />
                                          <div>
                                                <span className='md:text-lg font-semibold'>{user.username}</span>
                                                <p className='ellipsis-text text-lg max-w-[270px]'>
                                                      <span className='font-bold'>Email: </span>
                                                      {user.email}
                                                </p>
                                          </div>
                                    </div>
                              </li>
                        ))}

                        {(selectedUsers && selectedUsers?.length > 0) && (
                              <div
                                    className='absolute bottom-5 right-5 flex items-center justify-center backdrop-blur-sm bg-gray-500/30 dark:bg-white/30 rounded-full h-14 w-14 cursor-pointer text-white hover:text-red-500 group'
                                    onClick={clearSelectedUsers}
                              >
                                    <span className="material-symbols-outlined text-3xl transition-all duration-200 group-hover:scale-110">delete</span>
                              </div>
                        )}
                  </ul>
            </div>
      )
}

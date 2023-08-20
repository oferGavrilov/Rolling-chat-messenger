import { IUser } from '../../model/user.model'

interface Props {
      users: IUser[]
      onSelectChat: CallableFunction
}

export default function UsersList ({ users, onSelectChat }: Props): JSX.Element {
      return (
            <ul className='user-list pt-0 pb-20 my-6'>
                  {users.map((user: IUser) => (
                        <li
                              key={user._id}
                              className='user-card'
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
            </ul>
      )
}

import { IUser } from '../../model/user.model'

export default function UserInfo ({ user }: { user: IUser | null }): JSX.Element {

      if(!user) return (<div></div>)

      return (
            <div className="flex flex-col items-center">
                  <img
                        src={user.profileImg}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-5 object-cover opacity-0 object-top fade-grow-up-profile"
                        alt="profile"
                  />
                  <span className="text-2xl font-semibold dark:text-dark-primary-text">{user.username}</span>
                  <span className="text-gray-500 dark:text-gray-200">{user.email}</span>
            </div>
      )
}

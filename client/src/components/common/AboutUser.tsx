import { IUser } from '../../model/user.model'

export default function AboutUser ({ user }: { user: IUser | null }): JSX.Element {

      if (!user) return (<div></div>)
      return (
            <div className="mt-5 px-6">
                  <div className="flex flex-col pt-2">
                        <h2 className="text-lg font-semibold dark:text-dark-primary-text">About</h2>
                        <p className="text-gray-500 py-2 text-sm dark:text-gray-300">{user.about || 'Hello There :) '}</p>
                  </div>
            </div>
      )
}

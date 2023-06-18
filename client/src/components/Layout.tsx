import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'
import SearchUsers from './SearchUsers'

export default function Layout () {

      return (
            <div>
                  <AppHeader />
                  <Outlet />

            </div>
      )
}

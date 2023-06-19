import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'

export default function Layout () {

      return (
            <div>
                  <Outlet />
            </div>
      )
}

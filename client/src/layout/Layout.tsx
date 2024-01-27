import { useEffect, useState } from "react"
import { userService } from "../services/user.service"
import { Outlet, useNavigate } from "react-router-dom"
import { AuthState } from "../context/useAuth"
import Loading from "../components/Loading"
import socketService from "../services/socket.service"


export const Layout: React.FC = () => {
    const { setUser, justLoggedIn, setJustLoggedIn } = AuthState()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function checkUser() {
            const loggedInUser = userService.getLoggedinUser()

            if (loggedInUser) {
                setUser(loggedInUser)

                if (justLoggedIn) {
                    socketService.setup(loggedInUser._id)
                    socketService.login(loggedInUser._id)
                    setJustLoggedIn(false)
                }
            } else {
                navigate('/auth')
            }

            setLoading(false)
        }

        checkUser()

    }, [setUser, navigate])

    if (loading) {
        return <Loading />
    }

    return <Outlet />
}
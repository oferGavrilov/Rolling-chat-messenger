import { useEffect, useState } from "react"
import { userService } from "../services/user.service"
import { Outlet, useNavigate } from "react-router-dom"
import { AuthState } from "../context/useAuth"
import Loading from "../components/Loading"
import socketService from "../services/socket.service"

export const Layout: React.FC = () => {
    const { setUser, justLoggedIn, setJustLoggedIn, user } = AuthState()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function checkUser() {
            try {
                if (justLoggedIn) {
                    if (!user) return navigate('/auth')

                    setUser(user)
                    socketService.login(user._id)
                    setJustLoggedIn(false)
                    return
                }

                const response = await userService.validateUser()

                if (response.isValid && response.user) {
                    setUser(response.user)

                } else {
                    // navigate('/auth')
                }
            } catch (err) {
                console.error('Error validating user:', err)
                console.clear()
                navigate('/auth')
            } finally {
                setLoading(false)
            }
        }

        checkUser()
    }, [])


    if (loading) {
        return <Loading />
    }

    return <Outlet />
}
import { PropsWithChildren, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthState } from "../context/useAuth"
import { userService } from "../services/user.service"

type ProtectedRouteProps = PropsWithChildren

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user: loggedInUser, setUser, justLoggedIn, setJustLoggedIn } = AuthState()
    const navigate = useNavigate()

    useEffect(() => {
        // in case user is not logged in, redirect to login page
        if (loggedInUser === null) {
            navigate('/auth', { replace: true })
            return
        }

        // in case user just logged in, return to chat page
        if (justLoggedIn) {
            setJustLoggedIn(false)
            return
        }

        // in case user is logged in, redirect to chat page, but validate tokens on server first
        const validateUser = async () => {
            const { isValid, user } = await userService.validateUser()

            // in case user is not valid, redirect to login page
            if (!isValid || !user) {
                navigate('/auth', { replace: true })
                return
            }

            // in case user is valid, set user in context
            setUser(user)
        }
        validateUser()
    }, [navigate, loggedInUser === null, setUser])

    return children
}
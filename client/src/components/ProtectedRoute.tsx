import { PropsWithChildren, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthState } from "../context/useAuth"
import { userService } from "../services/user.service"
import Loading from "./Loading"

type ProtectedRouteProps = PropsWithChildren

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isUserValidated, setIsUserValidated] = useState<boolean>(false);
    const { user: loggedInUser, setUser, justLoggedIn, setJustLoggedIn } = AuthState()
    const navigate = useNavigate()

    useEffect(() => {
        // in case user is not logged in, redirect to login page
        if (loggedInUser === null) {
            navigate('/auth', { replace: true })
            return
        }

        const validateUser = async () => {
            if (justLoggedIn) {
                // Consider the user validated if just logged in
                setIsUserValidated(true);
                setJustLoggedIn(false); // Reset justLoggedIn flag
            } else {
                // Validate tokens on server for already logged-in user
                const { isValid, user } = await userService.validateUser();

                if (!isValid || !user) {
                    // Redirect to login page if user is not valid
                    navigate('/auth', { replace: true });
                } else {
                    // User is valid, update user state and allow access
                    setUser(user);
                }
            }
        };

        validateUser();
    }, [navigate, loggedInUser === null, setUser])

    return isUserValidated ? <>{children}</> : <Loading />;
}
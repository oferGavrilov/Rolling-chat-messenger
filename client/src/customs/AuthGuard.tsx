import { Navigate , RouteProps  } from 'react-router-dom';

type AuthGuardProps = {
  children: React.ReactNode;
} & RouteProps;

function AuthGuard ({ children }: AuthGuardProps): JSX.Element {
  const isLoggedIn = false

  return isLoggedIn ? <>{ children }</> : <Navigate to="/login" />
}

export default AuthGuard;

import { Suspense, lazy } from "react"
import { createBrowserRouter, Outlet, RouterProvider, } from "react-router-dom"

const Home = lazy(() => import('./pages/Home'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const Auth = lazy(() => import('./pages/Auth'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const NotFound = lazy(() => import('./pages/NotFound'))

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import AuthProvider from "./context/useAuth"
import Loading from "./components/Loading"
import Notification from "./components/Notification"
import ProtectedRoute from "./components/ProtectedRoute"
import ErrorBoundary from "./ErrorBoundary"

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    ),
  },
  { path: '/auth', element: <Auth /> },
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <ProtectedLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: '/chat',
        element: (
          <ErrorBoundary>
            <ChatPage />
          </ErrorBoundary>
        )
      }
    ]
  },
  { path: '/reset-password/:token', element: <ResetPassword /> },
  { path: '*', element: <NotFound /> }
])

export const App = () => (
  <AuthProvider>
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
    <ToastContainer pauseOnFocusLoss={false} autoClose={2500} />
    <Notification />
  </AuthProvider>
)

export default App

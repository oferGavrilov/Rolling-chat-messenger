import { Suspense, lazy } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

const Home = lazy(() => import('./pages/Home'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const Auth = lazy(() => import('./pages/Auth'))

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import AuthProvider from "./context/useAuth"
import Loading from "./components/Loading"
import NotFound from "./pages/NotFound"
import Notification from "./components/Notification"
import { Layout } from "./layout/Layout"
import ResetPassword from "./pages/ResetPassword"

// For testing purposes
export const AppRoutes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>

          <Route index element={<Home />} />
          <Route path="/" element={<Layout />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>

          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer />
      <Notification />
    </AuthProvider>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App

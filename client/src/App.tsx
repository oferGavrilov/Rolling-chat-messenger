import { Suspense, lazy } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

const Home = lazy(() => import('./pages/Home'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const Login = lazy(() => import('./pages/Auth'))

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import AuthProvider from "./context/useAuth"
import Loading from "./components/Loading"
import NotFound from "./pages/NotFound"
import Notification from "./components/Notification"

// For testing purposes
export const AppRoutes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<Login />} />
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

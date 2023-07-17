import { Suspense, lazy } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
// import Home from "./pages/Home"
// import ChatPage from "./pages/ChatPage"
// import Login from "./pages/Auth"

const Home = lazy(() => import('./pages/Home'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const Login = lazy(() => import('./pages/Auth'))

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import AuthProvider from "./context/useAuth"
import Loading from "./components/Loading"

function App () {

  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </AuthProvider>
    </Router>
  )
}

export default App

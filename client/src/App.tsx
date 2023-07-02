import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import ChatPage from "./pages/ChatPage"
import Login from "./pages/Auth"

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import AuthProvider from "./context/useAuth"

function App () {

  return (
    <Router>
      <AuthProvider>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </Router>
  )
}

export default App

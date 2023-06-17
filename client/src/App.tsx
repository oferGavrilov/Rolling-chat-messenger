import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import Login from "./pages/Login"
import AuthGuard from "./customs/AuthGuard"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App () {

  return (
    <Router>
      <main className="min-h-screen">
        <Routes>
            <Route path="/" element={<AuthGuard children={<Home />} />} />
            <Route path="/chat" Component={Chat} />
            <Route path="/login" Component={Login} />
        </Routes>
        <ToastContainer />
      </main>
    </Router>
  )
}

export default App

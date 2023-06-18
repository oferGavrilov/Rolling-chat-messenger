import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import Login from "./pages/Auth"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatProvider from "./context/ChatProvider"
import Layout from "./components/Layout";
import SearchUsers from "./components/SearchUsers";

function App () {

  return (
    <Router>
      <ChatProvider>
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
          <ToastContainer />
        </main>
      </ChatProvider>
    </Router>
  )
}

export default App

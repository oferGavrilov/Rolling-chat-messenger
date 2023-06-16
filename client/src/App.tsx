import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import Login from "./pages/Login"

function App () {

  return (
    <Router>
      <main className="min-h-screen">
      <Routes>
        <Route path="/" Component={Home}/>
        <Route path="/chat" Component={Chat} />
        <Route path="/login" Component={Login} />
      </Routes>
      </main>
    </Router>
  )
}

export default App

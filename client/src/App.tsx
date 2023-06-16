import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Chat from "./pages/Chat"

function App () {

  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home}/>
        <Route path="/chat" Component={Chat} />
      </Routes>
    </Router>
  )
}

export default App

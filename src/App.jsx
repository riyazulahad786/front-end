import {} from 'react'
import Navbar from './components/Navbar'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
function App() {
  return (
    <div>
      <Navbar/>
      <Router>
         <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
         </Routes>
      </Router>
    </div>
  )
}

export default App
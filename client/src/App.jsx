import { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faUser } from '@fortawesome/free-solid-svg-icons'
import './App.css'
import QueueManagment from './QueManagement.jsx'


function App() {
  // const [count, setCount] = useState(0)
  // const [services, setServices] = useState([])
  // const [counters, setCounters] = useState([])


  const joinQueue = () => {
    console.log('joinQueue')
  }

  const serveNext = (counterId) => {
    console.log('serveNext', counterId)
  }



  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  )
}

function Main() {
  <Routes>
      <Route path="/" element={<QueueManagment />}>
      </Route>
    </Routes>
}

export default App

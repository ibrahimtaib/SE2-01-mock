import { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faUser } from '@fortawesome/free-solid-svg-icons'
  import {QueueManagement} from './QueManagement';
import './App.css'


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
      <Route path="/" element={<QueManagment />}>
      </Route>
    </Routes>
}

export default App

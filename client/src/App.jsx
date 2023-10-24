import { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faUser } from '@fortawesome/free-solid-svg-icons'
import './App.css'
import QueueManagment from './QueManagement.jsx'
import API from './API';
import LoginComponent from './LoginComponent';


function App() {
  //const [count, setCount] = useState(0)
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
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);


  const loginSuccessful = (user) => {
    setLoggedIn(true);
    setUser(user);

  }

  const doLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setUser(undefined);
  }

  useEffect(() => {
  
    API.getUserInfo()
      .then(user => {
        loginSuccessful(user);
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<></>} />
        <Route path="" element={<QueueManagment /> }></Route>
        <Route path="/login" element={<LoginComponent />}></Route>
    </Routes>
  )
}

export default App

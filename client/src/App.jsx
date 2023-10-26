import { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, } from 'react-router-dom';

import './App.css'
import QueueManagment from './QueManagement.jsx'
// import NavHeader from './NavBarComponent'; NOT USED
import API from './api';
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { LoginComponent, LogoutButton } from './LoginComponent';


function App() {
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const doLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setUser(undefined);
  }

  const loginSuccessful = (user) => {
    setLoggedIn(true);
    setUser(user);
  }

  useEffect(() => {

    API.getUserInfo()
      .then(user => {
        loginSuccessful(user);
      })
      .catch(err => {
        //
      });
    setTimeout(() => setWaiting(false), 1000);
  }, []);



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QueueManagment loggedIn={loggedIn} doLogout={doLogout} user={user} />} />
        <Route path="/login" element={loggedIn ? <Navigate replace to='/' /> : <LoginComponent loginSuccessful={loginSuccessful} setWaiting={setWaiting}></LoginComponent>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

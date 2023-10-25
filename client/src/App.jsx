//import { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css'
import QueueManagment from './QueManagement.jsx'
import NavHeader from './NavBarComponent';
import API from './API';
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import {LoginComponent, LogoutButton} from './LoginComponent';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QueueManagment />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

// function Main() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(undefined);
//   const [message, setMessage] = useState('');


//   const loginSuccessful = (user) => {
//     setLoggedIn(true);
//     setUser(user);

//   }

//   const doLogout = async () => {
//     await API.logout();
//     setLoggedIn(false);
//     setUser(undefined);
//   }

//   useEffect(() => {
  
//     API.getUserInfo()
//       .then(user => {
//         loginSuccessful(user);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   return (
//       <Routes>
//       <Route element={
//     <>
//       <NavHeader loggedIn={loggedIn} handleLogout={doLogout}/>
//       <Container fluid className="mt-3">
//         {message && <Row>
//           <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
//         </Row> }
//         <Outlet/>
//       </Container>
//     </>} >
//         <Route path="/" element={<></>} />
//           <Route path="" element={<QueueManagment /> }></Route>
//           <Route path="/login" element={<LoginComponent />}></Route>
//           </Route>
//       </Routes>
//   )
// }

export default App

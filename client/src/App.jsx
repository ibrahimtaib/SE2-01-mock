import { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faUser } from '@fortawesome/free-solid-svg-icons'
import './App.css'


function App() {

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

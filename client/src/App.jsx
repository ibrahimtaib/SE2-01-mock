//import { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom';

import './App.css'
import QueueManagment from './QueManagement.jsx'


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


export default App

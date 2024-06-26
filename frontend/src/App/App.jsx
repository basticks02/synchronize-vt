import React from 'react'
import Landing from '../Landing/Landing'
import Login from '../Login/Login'
import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

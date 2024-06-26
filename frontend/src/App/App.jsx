import React from 'react'
import Landing from '../Landing/Landing'
import Login from '../Login/Login'
import MyProfile from '../MyProfile/MyProfile'
import Patients from '../Patients/Patients'
import Locate from '../Locate/Locate'
import Covid from '../Covid/Covid'
import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/locate" element={<Locate />} />
        <Route path="/covid" element={<Covid />} />
      </Routes>
    </Router>
  )
}

import React from 'react'
import Landing from '../Landing/Landing'
import Login from '../Login/Login'
import MyProfile from '../MyProfile/MyProfile'
import Patients from '../Patients/Patients'
import Discover from '../Discover/Discover'
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
        <Route path="/discover" element={<Discover />} />
      </Routes>
    </Router>
  )
}

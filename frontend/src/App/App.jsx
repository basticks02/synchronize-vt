import React from 'react'
import Landing from '../Landing/Landing'
import Login from '../Login/Login'
import MyProfile from '../MyProfile/MyProfile'
import Patients from '../Patients/Patients'
import Discover from '../Discover/Discover'
import Signup from '../Login/Signup'
import './App.css'
import {UserContext} from '../UserContext'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'

export default function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  // Save the user data to storage whenever the user state changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);


  return (
    <>
      <UserContext.Provider value={{ user, updateUser }}></UserContext.Provider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
    </>
  )
}

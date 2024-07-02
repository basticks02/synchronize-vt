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
import api from '../api'


export default function App() {
  const [user, setUser] = useState(null)

  const updateUser = (newUser) => {
    setUser(newUser);
  };


  // Save the user data to storage whenever the user state changes
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/api/user/current', { withCredentials: true });
        updateUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch current user', error);
        if (error.response && error.response.status === 401 ) {
          updateUser(null);3
        }
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Landing />} />
            {/* <Route path="/" element={user ? <Landing /> : <Login />} /> N/B: To confirm that User is still logged in after page refresh */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/discover" element={<Discover />} />
            {user && (
              <>
                <Route path="/myprofile" element={<MyProfile />} />
                <Route path="/patients" element={<Patients />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  )
}

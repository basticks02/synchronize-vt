import './Navbar.css'
import React from 'react'
import {Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <>
        <nav className='navbar'>
            <Link to="/login">Login</Link>
            <Link to="/">Home</Link>
            <Link to="/myprofile">My Profile</Link>
            <Link to="/patients">Patients</Link>
            <Link to="/discover">Discover</Link>
        </nav>
    </>
  )
}

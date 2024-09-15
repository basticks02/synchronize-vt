import React, {useState, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import api from '../api'
import AuthContainer from './Authcontainer'


export default function Signup() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault();
        const data = {
            username,
            email,
            password,
            role
        }
        if (Object.values(data).every(field=>field)) {
          try{
            const response = await api.post('api/user/signup', data)
            alert("Sign Up Successful!")
            navigate('/login')
          } catch (error) {
            const errorMessage = error.response ? error.response.data.error : error.message;
            if (errorMessage === 'A physician account already exists') {
              alert('A physician account already exists. Only one physician account can be created.');
            } else {
              console.error('Error signing up.', errorMessage);
              alert('Sign Up Failed: ' + errorMessage);
            }
          }
        } else{
          alert("Please fill out all fields")
        }
        
    }

  return (
    <AuthContainer
      title="Sign Up"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign In"
    >
      <form onSubmit={handleSignup}>
        <div className='entry'>
          <label htmlFor="Username">Username</label>
          <input
            type="text"
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='First name (recommended)'
            required
          />
        </div>
        <div className='entry'>
          <label htmlFor="Email Address">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='synchronize@gmail.com'
            required
          />
        </div>
        <div className='entry'>
          <label htmlFor="Password">Create Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='userRole'>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Role</option>
            <option value="patient">Patient</option>
            <option value="physician">Physician</option>
          </select>
        </div>
        <button className="signupbutton" type='submit'>Sign Up</button>
      </form>
    </AuthContainer>
  )
}

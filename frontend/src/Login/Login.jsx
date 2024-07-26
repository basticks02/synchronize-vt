import './Login.css'
import React, {useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { UserContext } from '../UserContext'
import AuthContainer from './Authcontainer'


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate()

  //Login Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    if (username && password) {
      try{
        const response = await api.post('/api/user/login', { username, password }, { withCredentials: true });
        const { user } = response.data;
        updateUser(user)
        navigate('/')
        alert("Successfully Logged In")
      } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message)
        alert("Unsuccessful login attempt. Try again.")
      }
    } else{
      alert("Please fill out all fields")
    }
  }

  return (
    <AuthContainer
      title="Sign In"
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkText="Sign Up"
    >
      <form className='loginform' onSubmit={handleLogin}>
        <div className='entry'>
          <label htmlFor="Username">Username</label>
          <input
            type="text"
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='entry'>
          <label htmlFor="Password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Sign In</button>
      </form>
    </AuthContainer>
  )
}

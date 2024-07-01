import './Login.css'
import React, {useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { UserContext } from '../UserContext'


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
    <>
      <div className='logincontainer'>

        <div className='welcomecontainer'>
          <h1>Welcome Back</h1>
          <p>Commited to service excellence</p>
          <div className='socialmediaicons'>
              <i className="fa-brands fa-facebook"></i>
              <i className="fa-brands fa-twitter"></i>
              <i className="fa-brands fa-instagram"></i>
              <i className="fa-solid fa-envelope"></i>
          </div>
        </div>

        <div className='authenticationcontainer'>
          <h2>Sign in</h2>
          <form className='loginform' onSubmit={handleLogin}>

            <div className='entry'>
              <label htmlFor="Username">Username</label>
              <input
                type="text"
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required/>
            </div>

            <div className='entry'>
              <label htmlFor="Password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                required />
            </div>

            <button type='submit'>Sign In</button>
          </form>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link> </p>
            <Link to="/" >Return to Home</Link>

        </div>

      </div>
    </>
  )
}

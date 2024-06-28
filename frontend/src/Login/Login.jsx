import './Login.css'
import React, {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //submission Logic
  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      // TODO: take this to the DB
      console.log('Form Data', {username, password})
    } else{
      alert("Please fill out all fields")
    }
  }

  return (
    <>
      <div className='logincontainer'>

        <div className='welcomecontainer'>
          <h1>Welcome Back</h1>
          <p>Commited to serivce excellence</p>
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

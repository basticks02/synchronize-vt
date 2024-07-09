import React, {useState, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UserContext} from '../UserContext'
import api from '../api'


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
    <div className='logincontainer'>
        <div className='welcomecontainer'>
          <h1>Welcome!</h1>
          <p>Commited to service excellence</p>
          <div className='socialmediaicons'>
              <i className="fa-brands fa-facebook"></i>
              <i className="fa-brands fa-twitter"></i>
              <i className="fa-brands fa-instagram"></i>
              <i className="fa-solid fa-envelope"></i>
          </div>
        </div>

        <div className='authenticationcontainer'>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>

            <div className='entry'>
              <label htmlFor="Username">Username</label>
              <input
                type="text"
                id='username'
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
                placeholder='First name (recommended)'
                required  />
            </div>

            <div className='entry'>
              <label htmlFor="Email Address">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                placeholder='synchronize@gmail.com'
                required />
            </div>

            <div className='entry'>
              <label htmlFor="Password">Create Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                />
            </div>

            <div className='userRole' >
                <select id="role" value={role} onChange={(e)=> setRole(e.target.value)}>
                    <option value="">Role</option>
                    <option value="patient">Patient</option>
                    <option value="physician">Physician</option>
                </select>
            </div>

            <button className="signupbutton" type='submit'>Sign Up</button>
          </form>
            <p>Already have an account? <Link to="/login">Sign In</Link> </p>
            <Link to="/" >Return to Home</Link>

        </div>
    </div>
  )
}

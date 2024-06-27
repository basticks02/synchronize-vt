import React from 'react'
import {Link} from 'react-router-dom'

export default function Signup() {
  return (
    <div className='logincontainer'>
        <div className='welcomecontainer'>
          <h1>Welcome!</h1>
          <p>Commited to serivce excellence</p>
          <div className='socialmediaicons'>
              <i className="fa-brands fa-facebook"></i>
              <i className="fa-brands fa-twitter"></i>
              <i className="fa-brands fa-instagram"></i>
              <i className="fa-solid fa-envelope"></i>
          </div>
        </div>

        <div className='authenticationcontainer'>
          <h2>Sign Up</h2>
          <form>

            <div className='entry'>
              <label htmlFor="Username">Username</label>
              <input type="text" />
            </div>

            <div className='entry'>
              <label htmlFor="Email Address">Email Address</label>
              <input type="email" />
            </div>

            <div className='entry'>
              <label htmlFor="Password">Create Password</label>
              <input type="password" />
            </div>

            <div className='role'>
                <select className='userRole' name="Role" id="role">
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

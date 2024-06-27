import './Login.css'
import { Link } from 'react-router-dom'

export default function Login() {

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
          <form>
            <div className='entry'>
              <label htmlFor="Email Address">Email Address</label>
              <input type="email" />
            </div>
            <div className='entry'>
              <label htmlFor="Password">Password</label>
              <input type="password" />
            </div>
            <button type='submit'>Sign In</button>
          </form>
            <p>Don't have an account? <a href="">Sign Up</a> </p>
            <Link to="/" >Return to Home</Link>

        </div>

      </div>
    </>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'

export default function Authcontainer({ title, children, footerText, footerLink, footerLinkText }) {
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
        <h2>{title}</h2>
        {children}
        <p>{footerText} <Link to={footerLink}>{footerLinkText}</Link> </p>
        <Link to="/" >Return to Home</Link>
      </div>
    </div>
  )
}

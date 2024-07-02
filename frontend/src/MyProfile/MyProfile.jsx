import './MyProfile.css'
import Navbar from '../Navbar/Navbar'
import {UserContext} from '../UserContext'
import ProfileCard from './ProfileCard'
import React, { useContext } from 'react'

export default function MyProfile() {
  const {user} = useContext(UserContext)

  return (
    <>
      <Navbar/>

      <main>
        <section className="myprofilehero">
            <video className="video-background" autoPlay loop muted>
              <source src="../images/hero.mp4" type="video/mp4" />
            </video>
            <div className="hero-content">
              {user ? <h1>HEY {user.username} !</h1>: ''}
            </div>
        </section>

        <section className='myinfo'>
          <ProfileCard/>
          <button>Create Profile</button>
            {/* TODO: Add form for patients to enter personal info */}
        </section>

        <section className='calender'>
            {/* TODO: Integrate Calender API */}
        </section>

      </main>
    </>
  )
}

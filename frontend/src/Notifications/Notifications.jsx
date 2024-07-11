import React from 'react'
import './Notifications.css'
import Navbar from '../Navbar/Navbar'
import NotificationCard from './NotificationCard'

export default function Notifications() {
  return (
    <>
        <Navbar/>

        <main>
            <section className="myprofilehero">
                <video className="video-background" autoPlay loop muted>
                    <source src="/images/hero.mp4" type="video/mp4" />
                </video>
                <div className="hero-content">
                    <h1>Notifications</h1>
                </div>
            </section>

            <section className='notification-list'>
                <NotificationCard/>
            </section>
        </main>

    </>
  )
}

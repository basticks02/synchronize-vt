import './Locate.css'
import React from 'react'
import Navbar from '../Navbar/Navbar'

export default function Locate() {
  return (
    <>
        <Navbar/>

        <main>
            <section className="myprofilehero">
                <video className="video-background" autoPlay loop muted>
                    <source src="../images/hero.mp4" type="video/mp4" />
                </video>
                <div className="hero-content">
                    <h1>FIND YOUR WAY</h1>
                </div>
            </section>
        </main>
    </>
  )
}

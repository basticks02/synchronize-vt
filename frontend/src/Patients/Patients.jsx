import './Patients.css'
import Navbar from '../Navbar/Navbar'
import React from 'react'

export default function Patients() {
  return (
    <>
        <Navbar />

        <main>
            <section className="covidhero">
                <video className="video-background" autoPlay loop muted>
                    <source src="../images/hero.mp4" type="video/mp4" />
                </video>
                <div className="hero-content">
                    <h1>HEY 'PHYSICIAN'</h1>
                </div>
            </section>
      </main>
    </>
  )
}

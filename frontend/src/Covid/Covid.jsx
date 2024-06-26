import './Covid.css'
import React from 'react'
import Navbar from '../Navbar/Navbar'
export default function Covid() {
  return (
    <>
      <Navbar/>

      <main>
        <section className="covidhero">
            <video className="video-background" autoPlay loop muted>
              <source src="../images/hero.mp4" type="video/mp4" />
            </video>
            <div className="hero-content">
              <h1>KEEP YOURSELF SAFE</h1>
            </div>
        </section>
      </main>
    </>
  )
}

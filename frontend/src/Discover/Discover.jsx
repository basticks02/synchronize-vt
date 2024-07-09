import './Discover.css'
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
                    <h1>DISCOVER</h1>
                </div>
            </section>

            <section className='covid-resources'>
                <div className='covid-container'>
                    <div className='covid-usa'>
                        <h3>Covid USA</h3>
                    </div>
                    <div className='covid-worldwide'>
                        <h3>Covid WorldWide</h3>
                    </div>
                </div>

                <div className='covid-vaccines'>
                    <h3>Covid Vaccines Worldwide</h3>
                </div>

                <div className='covid-history'>
                    <h3>Covid History</h3>
                </div>
            </section>

            <footer>
                <p>Developed by Synchronize</p>
            </footer>
        </main>
    </>
  )
}

import './Discover.css'
import React from 'react'
import Navbar from '../Navbar/Navbar'
import Map from './Map'
import CovidNigeria from './CovidNigeria'
import CovidWorldwide from './CovidWorldWide'
import CovidHistory from './CovidHistory'
import HeroSection from '../HeroSection'

export default function Discover() {
  return (
    <>
        <Navbar/>

        <main>
            <HeroSection title="DISCOVER" />

            <section className='covid-resources'>
                <div className='covid-vaccines'>
                    <div className='heading'>
                        <h3>Covid Vaccines Rolled Out Worldwide</h3>
                    </div>
                    <Map/>
                </div>

                <div className='covid-container'>
                    <div className='covid-nigeria'>
                        <div className='heading'>
                            <h3>Covid Nigeria</h3>
                        </div>
                        <CovidNigeria/>
                    </div>
                    <div className='covid-worldwide'>
                        <div className='heading'>
                            <h3>Covid WorldWide</h3>
                        </div>
                        <CovidWorldwide/>
                    </div>
                </div>


                <div className='covid-history'>
                    <div className='heading'>
                        <h3>Covid History</h3>
                    </div>
                    <CovidHistory/>
                </div>
            </section>

            <footer>
                <p>Developed by Synchronize</p>
            </footer>
        </main>
    </>
  )
}

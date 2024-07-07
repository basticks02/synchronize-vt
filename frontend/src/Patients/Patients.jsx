import './Patients.css'
import Navbar from '../Navbar/Navbar'
import React from 'react'
import { useContext } from 'react'
import {UserContext} from '../UserContext'
import PatientCard from './PatientCard'

export default function Patients() {
  const {user} = useContext(UserContext)

  return (
    <>
        <Navbar />

        <main>
            <section className="myprofilehero">
                <video className="video-background" autoPlay loop muted>
                    <source src="../images/hero.mp4" type="video/mp4" />
                </video>
                <div className="hero-content">
                    <h1>HEY DR. {user.username}!</h1>
                </div>
            </section>

            <section className='patientlist'>
              <div className='patientHeadline'>
                <h3>Your Patients</h3>
              </div>
              <PatientCard/>
            </section>
      </main>
    </>
  )
}

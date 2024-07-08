import './Patients.css'
import Navbar from '../Navbar/Navbar'
import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../UserContext'
import PatientCard from './PatientCard'
import PatientProfileModal from './PatientProfileModal'
import api from '../api'

export default function Patients() {
  const {user} = useContext(UserContext)
  const [patients, setPatients] = useState([])
  const [isProfileModalOpen, setProfileModalOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState(null)

  //fetching all patients from the DB
  useEffect(() => {
    const fetchPatients = async () => {
      try{
        const response = await api.get('api/user/patients', {withCredentials: true})
        setPatients(response.data)
      } catch (error){
        console.error('Error fetching patients:', error.response ? ErrorEvent.response.data : error.message)
      }
    }
    fetchPatients()
  }, [])

  //TODO: Add Edit patient data & delete here

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
              {patients.map((patient) => (
                <PatientCard key ={patients.id} patient={patient}/>
              ))}
            </section>
      </main>
    </>
  )
}

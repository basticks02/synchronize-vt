import './ProfileCard.css'
import React, { useContext, useState, useEffect }  from 'react'
import {UserContext} from '../UserContext'
import api from '../api'

export default function ProfileCard() {
  const {user} = useContext(UserContext)
  const [patient, setPatient] = useState(null)

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await api.get('/api/user/myprofile', { withCredentials: true });
        setPatient(response.data);
      } catch (error) {
        console.error('Error fetching patient profile:', error.response ? error.response.data : error.message);
      }
    };

    fetchPatientInfo();
  }, [user])

  if (!patient) return <div>Loading...</div>



  return (
    <>
      <div className='card-container'>
        <div className='patient-photo'>
          <img src="https://picsum.photos/id/64/200/300" alt="Patient" />
        </div>
        <div className='patient-info'>
          <h1> {patient.firstname} {patient.lastname} </h1>

          <p>Place of Birth: {patient.place_of_birth}</p>
          <p>Date of Birth: {new Date(patient.date_of_birth).toLocaleDateString()}</p>
          <p>Sex: {patient.sex}</p>
          <p>Height: {patient.height} ft</p>
          <p>Weight: {patient.weight} lbs</p>

          <p>Address: {patient.address}</p>
          <p>Occupation: {patient.occupation}</p>
          <p>Phone: {patient.phone}</p>

          <p>Complaint: {patient.complaint}</p>
        </div>
      </div>
    </>
  )
}

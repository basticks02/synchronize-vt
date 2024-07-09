import React from 'react'
import './PatientCard.css'

export default function PatientCard({patient, onClick, onDelete}) {
  return (
    <div className='patient-card' onClick={() => onClick(patient.id)} >
        <div className='profile-picture'>
            <img src="https://picsum.photos/id/64/200/300" alt="patient" />
        </div>
        <div className='patient-name'>
            <p>{patient.firstname} {patient.lastname}</p>
        </div>
        <div className='patient-controls'>
            <i className="fa-regular fa-trash-can" onClick={(e) => { e.stopPropagation(); onDelete(patient.id); }}></i>
        </div>
    </div>
  )
}

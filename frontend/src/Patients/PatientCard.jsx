import React from 'react'
import './PatientCard.css'

export default function PatientCard() {
  return (
    <div className='patient-card'>
        <div className='profile-picture'>
            <img src="https://picsum.photos/id/64/200/300" alt="patient" />
        </div>
        <div className='patient-name'>
            <p>Ekomobong Ekanem</p>
        </div>
        <div className='patient-controls'>
            <i className="fa-regular fa-trash-can"></i>
            <i className="fa-regular fa-pen-to-square"></i>
        </div>
    </div>
  )
}

import './ProfileCard.css'
import React from 'react'

export default function ProfileCard() {
  return (
    <>
      <div className='card-container'>
        <div className='patient-photo'>
          <img src="https://picsum.photos/id/64/200/300" alt="Patient" />
        </div>
        <div className='patient-info'>
          <h1>Praise Ekanem</h1>
          
          <p>Place of Birth: Akwa Ibom</p>
          <p>Date of Birth: 2024-02-01</p>
          <p>Sex: Male</p>
          <p>Height: 6.4 ft</p>
          <p>Weight:200 lbs</p>

          <p>Address: 350 Sth St, San Jose</p>
          <p>Occupation: Software Engineer</p>
          <p>Phone: (202) 763-1327</p>

          <p>Complaint: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt esse possimus molestiae rerum dolorem! Sed consectetur culpa ullam impedit corporis est amet nesciunt, placeat, voluptatibus ex, beatae corrupti. In, tempore.</p>
        </div>
      </div>
    </>
  )
}

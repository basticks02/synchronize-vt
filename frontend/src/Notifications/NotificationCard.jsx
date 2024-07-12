import React from 'react'
import './NotificationCard.css'
import { useNavigate } from 'react-router-dom'

export default function NotificationCard({notification}) {
  const navigate = useNavigate()

  const handleNotificationClick = () => {
    navigate('/myprofile')
  }

  return (
    <div className='notification-card' onClick={handleNotificationClick}>
        <div className='patient-name'>
            <p>{notification}</p>
        </div>
    </div>

  )
}

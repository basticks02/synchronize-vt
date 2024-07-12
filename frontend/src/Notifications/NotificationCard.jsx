import React from 'react'
import './NotificationCard.css'

export default function NotificationCard({notification}) {
  return (
    <div className='notification-card'>
        <div className='patient-name'>
            <p>{notification}</p>
        </div>
    </div>

  )
}

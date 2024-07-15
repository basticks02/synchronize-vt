import React from 'react'
import './NotificationCard.css'

export default function NotificationCard({notification, onClick}) {

  return (
    <div className={`notification-card ${notification.read ? 'read' : ''}`} onClick={onClick}>
        <div className='patient-name'>
            <p>{notification.content || notification.message}</p>
        </div>
    </div>

  )
}

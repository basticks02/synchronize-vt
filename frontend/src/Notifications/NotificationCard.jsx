import React from 'react'
import './NotificationCard.css'

export default function NotificationCard({notification}) {
  return (
    <div className='notification-card'>
        <div className='notif-icon'>
            <i className="fa-regular fa-calendar"></i>
        </div>
        <div className='notification-title'>
            <p>{notification.content}</p>
        </div>
    </div>

  )
}

import React, {useState} from 'react'
import './PatientCard.css'
import api from '../api'

export default function PatientCard({patient, onClick}) {
  const [notificationsOn, setNotificationsOn] = useState(patient.notificationsOn)

  const toggleNotifications = async () => {
    try {
      const response = await api.put(`/api/user/patients/${patient.id}/toggle-notifications`, {}, { withCredentials: true });
      setNotificationsOn(response.data.notificationsOn);
    } catch (error) {
      console.error('Error toggling notifications:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='patient-card' onClick={() => onClick(patient.id)} >
        <div className='profile-picture'>
            <img src="https://picsum.photos/id/64/200/300" alt="patient" />
        </div>
        <div className='patient-name'>
            <p>{patient.firstname} {patient.lastname}</p>
        </div>
        <div className='notification-controls'>
        <i className={`fa-regular ${notificationsOn ? 'fa-bell' : 'fa-bell-slash'}`} onClick={(e) => { e.stopPropagation(); toggleNotifications(); }}></i>
        </div>
    </div>
  )
}

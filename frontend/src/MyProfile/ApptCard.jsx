import React, { useContext } from 'react'
import './ApptCard.css'
import { UserContext } from '../UserContext';

export default function ApptCard({appointment, handleDeleteAppointment, onEdit, isPast}) {
    const {user} = useContext(UserContext)

    //formatting for time (since  it was stored as a string in the db)
    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        const hourInt = parseInt(hour);
        const suffix = hourInt >= 12 ? 'PM' : 'AM';
        const formattedHour = hourInt % 12 || 12;
        return `${formattedHour}:${minute} ${suffix}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { timeZone: 'UTC' });
    };

    return (
        <>
            <div className={`cardContainer ${isPast ? 'pastAppointment' : ''}`}>
                <div className='apptDate'>
                    <p>{formatDate(appointment.date)}</p>
                </div>
                <div className='apptTitle'>
                    <h3>{appointment.title}</h3>
                </div>
                <div className='apptTime'>
                    <p>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</p>
                </div>
                {user.role === 'physician' && (
                    <div className='apptControls'>
                    <i className={`fa-regular fa-trash-can ${isPast ? 'icon-greyed-out' : ''}`} onClick={() => handleDeleteAppointment(appointment.id)}></i>
                    <i className={`fa-regular fa-pen-to-square ${isPast ? 'icon-greyed-out' : ''}`} onClick={() => onEdit(appointment)}></i>
                    </div>
                )}
            </div>
        </>
    )
}

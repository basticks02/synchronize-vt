import React from 'react'
import './ApptCard.css'

export default function ApptCard({appointment}) {

    //formatting for time (since  it was stored as a string in the db)
    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        const hourInt = parseInt(hour);
        const suffix = hourInt >= 12 ? 'PM' : 'AM';
        const formattedHour = hourInt % 12 || 12;
        return `${formattedHour}:${minute} ${suffix}`;
    };

    return (
        <>
            <div className='cardContainer'>
                <div className='apptDate'>
                    <p>{new Date(appointment.date).toLocaleDateString()}</p>
                </div>
                <div className='apptTitle'>
                    <h3>{appointment.title}</h3>
                </div>
                <div className='apptTime'>
                    <p>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</p>
                </div>
                <div className='apptContols'>
                    <i className="fa-regular fa-trash-can"></i>
                    <i className="fa-regular fa-pen-to-square"></i>
                </div>
            </div>
        </>
    )
}

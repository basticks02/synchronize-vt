import React, {useState} from 'react'
import './ApptModal.css'

export default function ApptModal({isApptModalOpen, handleApptModalClose, handleSubmitAppointment, title}) {
    const [appointmentData, setAppointmentData] = useState({
        title: '',
        date: '',
        start_time: '',
        end_time: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData((prevData) => ({ ...prevData, [name]: value }));
      };

    if (!isApptModalOpen) return null;

  return (
    <>
        <div className="modal-overlay">
            <div className="modal-content">
                <form onSubmit={(e) => handleSubmitAppointment(e, appointmentData)}>
                <p>{title}</p>
                <input name="title" placeholder="Title" value={appointmentData.title} onChange={handleChange} required />
                <input name="date" placeholder="Date" type="date" value={appointmentData.date} onChange={handleChange} required />
                <input name="start_time" placeholder="Start Time" type="time" value={appointmentData.start_time} onChange={handleChange} required />
                <input name="end_time" placeholder="End Time" type="time" value={appointmentData.end_time} onChange={handleChange} required />
                <div className='modal-controls'>
                    <button className="close-button" onClick={handleApptModalClose}>Cancel</button>
                    <button type="submit">Save</button>
                </div>
                </form>
            </div>
        </div>
    </>
  )
}

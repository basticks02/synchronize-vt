import React, {useState, useEffect} from 'react'
import './ApptModal.css'

export default function ApptModal({isApptModalOpen, handleApptModalClose, handleSubmitAppointment, title, initialData}) {
    const [appointmentData, setAppointmentData] = useState({
        title: '',
        date: '',
        start_time: '',
        end_time: ''
    })

    //for Editting
    useEffect(() => {
        if (isApptModalOpen && initialData) {
          setAppointmentData({
            title: initialData.title || '',
            date: initialData.date ? initialData.date.split('T')[0] : '',
            start_time: initialData.start_time || '',
            end_time: initialData.end_time || '',
          });
        }
      }, [isApptModalOpen, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateAppointment = () => {
      const currentDate = new Date();
      const appointmentDate = new Date(`${appointmentData.date}T${appointmentData.start_time}`);

      if (appointmentDate < currentDate) {
          alert('Cannot book an appointment in the past. Please select a future date and time.');
          return false;
      }
      return true;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateAppointment()) {
            handleSubmitAppointment(e, appointmentData);
        }
    };


    if (!isApptModalOpen) return null;

  return (
    <>
        <div className="modal-overlay">
            <div className="modal-content">
                <form onSubmit={handleFormSubmit}>
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

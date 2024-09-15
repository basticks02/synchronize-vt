import React from 'react'
import './ConfirmModal.css'

export default function ConfirmModal({ patient, conditions, onConfirm, canTurnOff, onClose}) {
  const getMessage = () => {
    const messages = [];
    if (conditions.hasUpcomingAppointments) {
      messages.push(`have an appointment in the next 3 days`);
    }
    if (conditions.hasManyAppointments) {
      messages.push(`have at least 5 appointments`);
    }
    if (conditions.isElder) {
      messages.push(`are an elder`);
    }
    if (conditions.isInfant) {
      messages.push(`are an infant`);
    }
    return messages.join(' and ');
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
    
  };

  return (
    <>
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirmation-modal-content" onClick={handleModalClick}>

        {canTurnOff ? (
          <>
            <h2>Turn off notifications for {patient.firstname}?</h2>
            <p>Are you sure you want to turn off notifications for {patient.firstname} {patient.lastname}? They {getMessage()}.</p>
            <div className='confirmation-controls'>
              <button onClick={() => onConfirm(false)}>Cancel</button>
              <button onClick={() => onConfirm(true)}>Yes</button>
            </div>
          </>
        ) : (
          <>
            <h2>IMPORTANT: Can NOT turn off notifications for {patient.firstname}</h2>
            <p>Notifications cannot be turned off for {patient.firstname} {patient.lastname} because they {getMessage()}.</p>
            <div className='confirmation-controls'>
              <button onClick={() => onConfirm(false)}>Close</button>
            </div>
          </>
        )}

      </div>
    </div>
    </>
  )
}

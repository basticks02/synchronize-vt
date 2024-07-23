import React from 'react'
import './ConfirmModal.css'

export default function ConfirmModal({ patient, conditions, onConfirm, onClose }) {
  const getMessage = () => {
    const messages = [];
    if (conditions.hasUpcomingAppointments) {
      messages.push(`they have an appointment in the next 3 days`);
    }
    if (conditions.hasManyAppointments) {
      messages.push(`they have at least 5 appointments`);
    }
    if (conditions.isElder) {
      messages.push(`they are an elder`);
    }
    if (conditions.isInfant) {
      messages.push(`they are an infant`);
    }
    return messages.join(', ');
  };

  return (
    <>
    <div className="modal-overlay">
      <div className="confirmation-modal-content">
        <h2>Turn off notifications for {patient.firstname}?</h2>
        <p>Are you sure you want to turn off notifications for {patient.firstname} {patient.lastname} because {getMessage()}?</p>
        <div className='confirmation-controls'>
          <button onClick={() => {onConfirm(false); onClose(); window.location.reload()}}>No</button>
          <button onClick={() => {onConfirm(true); onClose()}}>Yes</button>
        </div>
      </div>
    </div>
    </>
  )
}

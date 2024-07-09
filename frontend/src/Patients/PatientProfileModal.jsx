import React, { useState, useEffect } from 'react';
import './PatientProfileModal.css';
import ProfileCard from '../MyProfile/ProfileCard';
import ApptCard from '../MyProfile/ApptCard';
import ProfileModal from '../MyProfile/ProfileModal';
import ApptModal from '../MyProfile/ApptModal';
import api from '../api';

export default function PatientProfileModal({ isOpen, onClose, patientId }) {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isApptModalOpen, setApptModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (isOpen && patientId) {
      const fetchPatientInfo = async () => {
        try {
          const response = await api.get(`/api/user/patients/${patientId}`, { withCredentials: true });
          setPatient(response.data);

          const appointmentsResponse = await api.get(`/api/user/patients/${patientId}/appointments`, { withCredentials: true });
          const sortedAppointments = appointmentsResponse.data.sort((a, b) => new Date(a.date) - new Date(b.date));
          setAppointments(sortedAppointments);
        } catch (error) {
          console.error('Error fetching patient profile:', error.response ? error.response.data : error.message);
        }
      };

      fetchPatientInfo();
    }
  }, [isOpen, patientId]);

  const handleSubmitAppointment = async (e, appointmentData) => {
    e.preventDefault();
    try {
      if (selectedAppointment) {
        const response = await api.put(`/api/user/appointments/${selectedAppointment.id}`, appointmentData, { withCredentials: true });
        const updatedAppointments = appointments.map(appt => appt.id === response.data.id ? response.data : appt).sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointments(updatedAppointments);
        setSelectedAppointment(null);
        alert('Appointment Updated Successfully');
      } else {
        const response = await api.post('/api/user/appointments', { ...appointmentData, patientId: patient.id }, { withCredentials: true });
        const updatedAppointments = [...appointments, response.data].sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointments(updatedAppointments);
        alert('Appointment Created Successfully');
      }
      setApptModalOpen(false);
    } catch (error) {
      console.error('Error creating appointment:', error.response ? error.response.data : error.message);
      alert('An error occurred while creating the appointment. Please try again.');
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setApptModalOpen(true);
  };

  const handleDeleteAppointment = async (id) => {
    try {
        await api.delete(`/api/user/appointments/${id}`, { withCredentials: true });
        const updatedAppointments = appointments.filter(appointment => appointment.id !== id).sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointments(updatedAppointments);
    } catch (error) {
        console.error('Error deleting appointment:', error.response ? error.response.data : error.message);
    }
  };

  const currentAppointments = appointments.filter(appointment => new Date(appointment.date) >= new Date());
  const pastAppointments = appointments.filter(appointment => new Date(appointment.date) < new Date());

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="patient-modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {patient && (
          <>
            <ProfileCard patient={patient} setPatient={setPatient} showMenu={false} />

            <ProfileModal
              isOpen={isProfileModalOpen}
              onClose={() => setProfileModalOpen(false)}
              initialData={patient}
              title="Edit Patient Profile"
            />

            <div className='appointments'>
              <div className='createApptButton'>
                <button onClick={() => setApptModalOpen(true)}> <i className='fa-solid fa-plus'></i> </button>
              </div>

              <ApptModal
                isApptModalOpen={isApptModalOpen}
                handleApptModalClose={() => setApptModalOpen(false)}
                handleSubmitAppointment={handleSubmitAppointment}
                title={selectedAppointment ? "Edit Appointment" : "Create Appointment"}
                initialData={selectedAppointment}
              />

              <div className='apptList'>
                <div className='apptHeadline'>
                  <h3>Appointments</h3>
                </div>
                {currentAppointments.map((appointment) => (
                  <ApptCard key={appointment.id} appointment={appointment} handleDeleteAppointment={handleDeleteAppointment} onEdit={handleEditAppointment} />
                ))}
                {pastAppointments.map((appointment) => (
                  <ApptCard key={appointment.id} appointment={appointment} handleDeleteAppointment={handleDeleteAppointment} onEdit={handleEditAppointment} isPast />
                ))}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

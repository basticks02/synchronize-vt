import './MyProfile.css'
import Navbar from '../Navbar/Navbar'
import {UserContext} from '../UserContext'
import ProfileCard from './ProfileCard'
import React, { useContext, useState, useEffect } from 'react'
import ProfileModal from './ProfileModal'
import ApptModal from './ApptModal'
import ApptCard from './ApptCard'
import api from '../api';

export default function MyProfile() {
  const {user, updateUser} = useContext(UserContext)
  const [isModalOpen, setModalOpen] = useState(false);
  const [isApptModalOpen, setApptModalOpen] = useState(false)
  const [patient, setPatient] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleApptModalOpen = () => setApptModalOpen(true)
  const handleApptModalClose = () => {
    setApptModalOpen(false);
    setSelectedAppointment(null)}

  //fetches patient data on every render of My Profile
  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await api.get('/api/user/myprofile', { withCredentials: true });
        setPatient(response.data);

        const appointmentsResponse = await api.get('/api/user/appointments', { withCredentials: true });
        const sortedAppointments = appointmentsResponse.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointments(sortedAppointments);
      } catch (error) {
        console.error('Error fetching patient profile:', error.response ? error.response.data : error.message);
      }
    };

    fetchPatientInfo();
  }, [user])

  const handleSubmitPatientInfo = async (e, formData) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/user/myprofile', formData, { withCredentials: true });
      updateUser({ ...user, patient: response.data });
      setPatient(response.data);
      handleModalClose();
      alert('Profile Created Successfully')
    } catch (error) {
      console.error('Error creating profile:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 400) {
        alert('Patient Profile already exists for this user');
      } else {
        alert('An error occurred while creating the profile. Please try again.');
      }
    }
  };

  //Creating & Editting an appointment
  const handleSubmitAppointment = async (e, appointmentData) => {
    e.preventDefault();
    try {
      if(selectedAppointment){
        const response = await api.put(`/api/user/appointments/${selectedAppointment.id}`, appointmentData, { withCredentials: true });
        setAppointments(appointments.map(appt => appt.id === response.data.id ? response.data : appt));
        setSelectedAppointment(null);
        alert('Appointment Updated Successfully');
      } else {
        const response = await api.post('/api/user/appointments', { ...appointmentData, patientId: patient.id }, { withCredentials: true });
        setAppointments([...appointments, response.data]);
        alert('Appointment Created Successfully');
      }
      handleApptModalClose();
    } catch (error) {
      console.error('Error creating appointment:', error.response ? error.response.data : error.message);
      alert('An error occurred while creating the appointment. Please try again.');
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    handleApptModalOpen();
  };

  //Deleting an appointment
  const handleDeleteAppointment = async (id) => {
    try {
      await api.delete(`/api/user/appointments/${id}`, { withCredentials: true });
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error.response ? error.response.data : error.message);
    }
  };

  const currentAppointments = appointments.filter(appointment => new Date(appointment.date) >= new Date());
  const pastAppointments = appointments.filter(appointment => new Date(appointment.date) < new Date());




  return (
    <>
      <Navbar/>

      <main>
        <section className="myprofilehero">
            <video className="video-background" autoPlay loop muted>
              <source src="../images/hero.mp4" type="video/mp4" />
            </video>
            <div className="hero-content">
              {user ? <h1>Hey {user.username} !</h1>: ''}
            </div>
        </section>

        <section className='myinfo'>
          {patient ? <ProfileCard patient={patient} setPatient={setPatient}/> : <div></div>}
          <div className='createProfileButton'>
            {!patient && <button onClick={handleModalOpen}>Create Profile</button>}
          </div>
          <ProfileModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            handleSubmitPatientInfo={handleSubmitPatientInfo}
            title ="Create Patient Profile"/>
        </section>

        <section className='appointments'>
          <div className='createApptButton'>
            <button onClick={handleApptModalOpen}> <i className="fa-solid fa-plus"></i></button>
          </div>
          <ApptModal
            isApptModalOpen={isApptModalOpen}
            handleApptModalClose={handleApptModalClose}
            handleSubmitAppointment={handleSubmitAppointment}
            title={selectedAppointment ? "Edit Appointment" : "Create Appointment"}
            initialData = {selectedAppointment}
          />

          <div className='apptList'>
            <div className='apptHeadline'>
              <h3>Current Appointments</h3>
            </div>
            {currentAppointments.map((appointment) => (
              <ApptCard key={appointment.id} appointment={appointment} handleDeleteAppointment={handleDeleteAppointment} onEdit={handleEditAppointment} />
            ))}
            
            {pastAppointments.map((appointment) => (
              <ApptCard key={appointment.id} appointment={appointment} handleDeleteAppointment={handleDeleteAppointment} onEdit={handleEditAppointment} isPast />
            ))}
          </div>
        </section>


      </main>

      <footer>
        <p>Developed by Synchronize</p>
      </footer>
    </>
  )
}

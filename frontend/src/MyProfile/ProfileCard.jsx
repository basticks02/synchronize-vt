import './ProfileCard.css'
import React, { useContext, useState, useEffect }  from 'react'
import {UserContext} from '../UserContext'
import api from '../api'
import ProfileModal from './ProfileModal'

export default function ProfileCard({patient, setPatient, showMenu = true}) {
  const {user, updateUser} = useContext(UserContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(patient.notificationsOn);
  const [recommendations, setRecommendations] = useState({ bestMedicationCompatibility: '', bestMedicationFinal: '' });

  if (!patient) return <div></div>

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/api/user/recommend', {
          params: { patientId: user.role === 'physician' ? patient.id : undefined },
          withCredentials: true
        });
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error.response ? error.response.data : error.message);
      }
    };

    fetchRecommendations();
  }, [patient, user.role]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleEditProfile = () => {
    setEditModalOpen(true);
    setMenuOpen(false);
  };

  const toggleNotifications = async () => {
    try {
      const response = await api.put(`/api/user/patients/${patient.id}/toggle-notifications`, {}, { withCredentials: true });
      setNotificationsOn(response.data.notificationsOn);
    } catch (error) {
      console.error('Error toggling notifications:', error.response ? error.response.data : error.message);
    }
  };

  //Update patient profile
  const handleUpdatePatientInfo = async (e, formData) => {
    e.preventDefault();
    try {
      let response;
      if (formData instanceof FormData) {
        response = await api.put('/api/user/myprofile', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.put('/api/user/myprofile', formData, { withCredentials: true });
      }
      setPatient(response.data);
      updateUser({ ...user, patient: response.data });
      setEditModalOpen(false);
      alert('Profile Updated Successfully');
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
      alert('An error occurred while updating the profile. Please try again.');
    }
  };

  //deletes patient profile
  const handleDeleteProfile = async () => {
    try{
      await api.delete('/api/user/myprofile', { withCredentials: true })
      setPatient(null)
      updateUser({...user, patient: null})
      setMenuOpen(false)
    } catch (error) {
      console.error('Error deleting patient profile:', error.response ? error.response.data : error.message);
    }
  }

  // Sort symptoms by priority
  const sortedSymptoms = patient.symptoms ? [...patient.symptoms].sort((a, b) => b.priority - a.priority) : [];

  return (
    <>
      <div className='card-container'>

        <div className='patient-photo'>
        {patient.profileImage ? (
            <img src={patient.profileImage} alt="Patient" />
          ) : (
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" alt="Patient" />
          )}
        </div>


        <div className='patient-info'>
          <h1> {patient.firstname}  {patient.lastname} </h1>

          <p>Place of Birth: {patient.place_of_birth}</p>
          <p>Date of Birth: {new Date(patient.date_of_birth).toLocaleDateString()}</p>
          <p>Sex: {patient.sex}</p>
          <p>Height: {patient.height} ft</p>
          <p>Weight: {patient.weight} lbs</p>

          <p>Address: {patient.address}</p>
          <p>Occupation: {patient.occupation}</p>
          <p>Phone: {patient.phone}</p>

          <div className='symptomContainer'>
            <p><strong>Symptoms <i className="fa-solid fa-angle-down"></i></strong></p>
            <ul className="symptoms-list">
              {sortedSymptoms.map((symptom, index) => (
                <li key={index} className={`symptom-item priority-${symptom.priority}`}>
                  {symptom.symptom} <span className="priority">({symptom.priority})</span>
                </li>
              ))}
            </ul>
          </div>


          <p><strong>Prescription Recommendations:</strong></p>
          <p>Best Medication Based on Compatibility: {recommendations.bestMedicationCompatibility}</p>
          <p>Best Medication Including Price Factor: {recommendations.bestMedicationFinal}</p>
        </div>

        {patient.qrCode && (
          <div className="qr-code">
            <img src={patient.qrCode} alt="Patient QR Code" />
          </div>
        )}

        {showMenu && (
          <span className='menu-container'>
            <i className="fa-solid fa-ellipsis-vertical" onClick={toggleMenu}></i>
            {menuOpen && (
              <ul className='menu'>
                <li className='appearance'>
                  <i class="fa-regular fa-eye"></i> <p>Appearance</p>
                </li>
                <li className='notifications-patient' onClick={toggleNotifications}>
                  <i className={`fa-regular ${notificationsOn ? 'fa-bell' : 'fa-bell-slash'}`}></i>
                </li>
                <li className='Edit' onClick={handleEditProfile}>Edit</li>
                <li className='Delete' onClick={handleDeleteProfile}>Delete</li>
              </ul>
            )}
          </span>
        )}

        <ProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          handleSubmitPatientInfo={handleUpdatePatientInfo}
          initialData={patient}
          title="Edit Patient Profile"
        />
      </div>
    </>
  )
}

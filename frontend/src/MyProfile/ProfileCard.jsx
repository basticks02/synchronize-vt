import './ProfileCard.css'
import React, { useContext, useState }  from 'react'
import {UserContext} from '../UserContext'
import api from '../api'
import ProfileModal from './ProfileModal'

export default function ProfileCard({patient, setPatient, showMenu = true}) {
  const {user, updateUser} = useContext(UserContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false);


  if (!patient) return <div></div>

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleEditProfile = () => {
    setEditModalOpen(true);
    setMenuOpen(false);
  };

  //Update patient profile
  const handleUpdatePatientInfo = async (e, formData) => {
    e.preventDefault();
    try {
      const response = await api.put('/api/user/myprofile', formData, { withCredentials: true });
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


  return (
    <>
      <div className='card-container'>

        <div className='patient-photo'>
          <img src="https://picsum.photos/id/64/200/300" alt="Patient" />
        </div>


        <div className='patient-info'>
          <h1> {patient.firstname} {patient.lastname} </h1>

          <p>Place of Birth: {patient.place_of_birth}</p>
          <p>Date of Birth: {new Date(patient.date_of_birth).toLocaleDateString()}</p>
          <p>Sex: {patient.sex}</p>
          <p>Height: {patient.height} ft</p>
          <p>Weight: {patient.weight} lbs</p>

          <p>Address: {patient.address}</p>
          <p>Occupation: {patient.occupation}</p>
          <p>Phone: {patient.phone}</p>

          <p>Complaint: {patient.complaint}</p>
        </div>

        {showMenu && (
          <span className='menu-container'>
            <i className="fa-solid fa-ellipsis-vertical" onClick={toggleMenu}></i>
            {menuOpen && (
              <ul className='menu'>
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

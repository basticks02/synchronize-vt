import React, { useState, useContext, useEffect } from 'react';
import './ProfileModal.css';
import { UserContext } from '../UserContext';

export default function ProfileModal({ isOpen, onClose, handleSubmitPatientInfo, initialData = {}, title }) {
  const { user } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    place_of_birth: '',
    date_of_birth: '',
    sex: '',
    height: '',
    weight: '',
    occupation: '',
    address: '',
    phone: '',
    symptoms: [],
  });

  const symptomsList = ['Fever', 'Cough', 'Headache', 'Diarrhea', 'Body Pain'];

  //for Editting
  useEffect(() => {
    if (isOpen && initialData && Object.keys(initialData).length > 0) {
      setFormData({
        firstname: initialData.firstname || '',
        lastname: initialData.lastname || '',
        place_of_birth: initialData.place_of_birth || '',
        date_of_birth: initialData.date_of_birth ? initialData.date_of_birth.split('T')[0] : '',
        sex: initialData.sex || '',
        height: initialData.height || '',
        weight: initialData.weight || '',
        occupation: initialData.occupation || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        symptoms: initialData.symptoms || symptomsList.map(symptom => ({ symptom, priority: 5 })),
      });
    }
  }, [isOpen, initialData]);

  //for New Profile
  useEffect(() => {
    if (isOpen && (!initialData || Object.keys(initialData).length === 0)) {
      setFormData({
        firstname: '',
        lastname: '',
        place_of_birth: '',
        date_of_birth: '',
        sex: '',
        height: '',
        weight: '',
        occupation: '',
        address: '',
        phone: '',
        symptoms: symptomsList.map(symptom => ({ symptom, priority: 5 })),
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSymptomPriorityChange = (e, index) => {
    const newSymptoms = [...formData.symptoms];
    newSymptoms[index] = { ...newSymptoms[index], priority: parseInt(e.target.value) };
    setFormData({ ...formData, symptoms: newSymptoms });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure each priority number is unique
    const prioritySet = new Set(formData.symptoms.map(symptom => symptom.priority));
    if (prioritySet.size !== formData.symptoms.length) {
      alert("Each symptom must have a unique priority number.");
      return;
    }

    // Stringify the symptoms array
    const payload = {
      ...formData,
      symptoms: JSON.stringify(formData.symptoms),
    };

    if (image) {
      const formData = new FormData();
      for (const key in payload) {
        formData.append(key, payload[key]);
      }
      formData.append('image', image);
      handleSubmitPatientInfo(e, formData);
    } else {
      // If there's no image, use the payload object as before
      handleSubmitPatientInfo(e, payload);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <p>{title}</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <input name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
          <input name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
          <input name="place_of_birth" placeholder="Place of Birth" value={formData.place_of_birth} onChange={handleChange} required />
          <input name="date_of_birth" placeholder="Date of Birth" type="date" value={formData.date_of_birth} onChange={handleChange} required />
          <input name="sex" placeholder="Sex" value={formData.sex} onChange={handleChange} required />
          <input name="height" placeholder="Height (in)" type="number" value={formData.height} onChange={handleChange} required />
          <input name="weight" placeholder="Weight (lbs)" type="number" value={formData.weight} onChange={handleChange} required />
          <input name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} required />
          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" type="tel" value={formData.phone} onChange={handleChange} required />

          <label className="label">Symptoms (1 = least important, 5 = most important)</label>
          <div className="field">
            {formData.symptoms.map((symptom, index) => (
              <div key={index} className="field has-addons">
                <div className="control">
                  <span>{symptom.symptom}</span>
                </div>
                <div className="control">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={symptom.priority}
                    onChange={(e) => handleSymptomPriorityChange(e, index)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className='modal-controls'>
            <button className="close-button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

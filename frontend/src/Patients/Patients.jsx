import './Patients.css'
import Navbar from '../Navbar/Navbar'
import React, {useState, useEffect, useContext} from 'react'
import { Html5Qrcode } from "html5-qrcode";
import {UserContext} from '../UserContext'
import PatientCard from './PatientCard'
import PatientProfileModal from './PatientProfileModal'
import api from '../api'
import HeroSection from '../HeroSection'
import Footer from '../Footer/Footer'

export default function Patients() {
  const {user} = useContext(UserContext)
  const [patients, setPatients] = useState([])
  const [isProfileModalOpen, setProfileModalOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setScannerOpen] = useState(false);

  let html5QrCode; 
  //fetching all patients from the DB & necessary filtering
  useEffect(() => {
    const fetchPatients = async () => {
      try{
        const response = await api.get('api/user/patients', {withCredentials: true})
        setPatients(response.data)
        setFilteredPatients(response.data);
      } catch (error){
        console.error('Error fetching patients:', error.response ? ErrorEvent.response.data : error.message)
      }
    }
    fetchPatients()
  }, [])

  useEffect(() => {
    const results = patients.filter(patient =>
      `${patient.firstname} ${patient.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchQuery, patients]);

  const handlePatientEdit = (patient) => {
    setSelectedPatientId(patient.id);
    setProfileModalOpen(true);
  };

  const handlePatientClick = (id) => {
    setSelectedPatientId(id);
    setProfileModalOpen(true);
  };

   // Handle QR code scan toggle
   const handleScan = () => {
    if (!isScannerOpen) {
      setScannerOpen(true);  // Open the scanner
    } else {
      handleCloseScanner();  // Close the scanner if it's already open
    }
  };

  // Initialize the QR code scanner when scanner is open
  useEffect(() => {
    if (isScannerOpen) {
      html5QrCode = new Html5Qrcode("reader");  // Create the QR code scanner instance
      html5QrCode.start(
        { facingMode: "environment" },  // Start the camera
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          const patientId = decodedText.split('/').pop();  // Extract the patientId from the decoded text
          setSelectedPatientId(patientId);
          setProfileModalOpen(true);
          handleCloseScanner();  // Close the scanner after scanning
        },
        (errorMessage) => {
          console.error("QR scan failed: ", errorMessage);
        }
      );
    }

    // Cleanup when the scanner is closed
    return () => {
      if (html5QrCode && isScannerOpen) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();  // Clear the camera stream and scanner
        }).catch((err) => {
          console.error("Failed to close QR scanner", err);
        });
      }
    };
  }, [isScannerOpen]);

  // Handle QR code scanner close
  const handleCloseScanner = () => {
    setScannerOpen(false);  // Set scanner state to closed
  };
  return (
    <>
        <Navbar />

        <main>
            <HeroSection title={`HEY DR. ${user.username}!`} />

            <div className='PatientSearch'>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                placeholder='Find a patient'
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <i className="fa-solid fa-qrcode" onClick={handleScan}></i>
              
            </div>

            {isScannerOpen && <div id="reader" style={{ width: "100%", height: "100%", marginTop: "20px" }}></div>}

            <section className='patientlist'>
              <div className='patientHeadline'>
                <h3>Your Patients</h3>
              </div>

              {filteredPatients.map((patient) => (
                <PatientCard
                  key ={patient.id}
                  patient={patient}
                  onClick={handlePatientClick}
                  onEdit={handlePatientEdit}/>
              ))}

              <PatientProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setProfileModalOpen(false)}
                    patientId={selectedPatientId}
              />
            </section>

            <Footer/>
      </main>
    </>
  )
}

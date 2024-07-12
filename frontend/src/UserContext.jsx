import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        const fetchUserAndPatient = async () => {
            try {
                const userResponse = await axios.get('http://localhost:4000/api/user/current');
                setUser(userResponse.data.user);
                console.log('User fetched:', userResponse.data.user);

                if (userResponse.data.user.role === 'patient') {
                    const patientResponse = await axios.get('http://localhost:4000/api/user/myprofile');
                    setPatient(patientResponse.data);
                    console.log('Patient fetched:', patientResponse.data);
                }
            } catch (error) {
                console.error('Error fetching user or patient:', error);
            }
        };

        fetchUserAndPatient();
    }, []);

    return (
        <UserContext.Provider value={{ user, patient, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

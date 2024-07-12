import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import { UserContext } from '../UserContext';
import Navbar from '../Navbar/Navbar';
import NotificationCard from './NotificationCard';
import api from '../api';
import './Notifications.css';

export default function Notifications() {
    const ws = useContext(WebSocketContext);
    const { patient } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        console.log('useEffect called');
        if (!patient) return;

        const fetchNotifications = async () => {
            console.log('Fetching notifications for patient:', patient);
            try {
                const response = await api.get(`/api/user/notifications/${patient.id}`);
                console.log('Notifications fetched:', response.data);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        if (ws) {
            ws.onmessage = (message) => {
                const data = JSON.parse(message.data);
                if (data.patientId === patient.id) {
                    setNotifications((prev) => [...prev, { content: data.message, timestamp: new Date().toISOString() }]);
                    console.log('State after WebSocket message:', notifications);
                }
            };
        }

        return () => {
            if (ws) {
                ws.onmessage = null;
            }
        };
    }, [ws, patient]);

    if (!patient) {
        console.log('Loading... Patient data is missing');
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <main>
                <section className="myprofilehero">
                    <video className="video-background" autoPlay loop muted>
                        <source src="/images/hero.mp4" type="video/mp4" />
                    </video>
                    <div className="hero-content">
                        <h1>Notifications</h1>
                    </div>
                </section>
                <section className='notification-list'>
                    {notifications.map((notification, index) => {
                        console.log('Rendering notification:', notification);
                        return <NotificationCard key={index} notification={notification} />;
                    })}
                </section>
            </main>
        </>
    );
}

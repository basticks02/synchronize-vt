import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import Navbar from '../Navbar/Navbar';
import NotificationCard from './NotificationCard';

export default function Notifications() {
    const ws = useContext(WebSocketContext);
    const { user } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        console.log('useEffect called')
        const fetchNotifications = async () => {
            if (user && user.patient) {
                console.log('Fetching notifications for user:', user);
                try {
                    const response = await api.get(`/api/user/notifications/${user.patient.id}`);
                    console.log(response.data)
                    setNotifications(response.data);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            }
        };

        fetchNotifications();

        if (ws) {
            ws.onmessage = (message) => {
                const data = JSON.parse(message.data);
                if (user && user.patient && data.patientId === user.patient.id) {
                    setNotifications((prev) => [...prev, { content: data.message, timestamp: new Date().toISOString() }]);
                }
            };
        }
    }, [ws, user]);

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

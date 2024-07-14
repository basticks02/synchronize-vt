import React, {useContext, useEffect, useState} from 'react'
import './Notifications.css'
import Navbar from '../Navbar/Navbar'
import NotificationCard from './NotificationCard'
import { WebSocketContext } from '../contexts/WebSocketContext';
import api from '../api';
import { useNavigate } from 'react-router-dom'

export default function Notifications() {
    const { updatedNotification } = useContext(WebSocketContext);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {

        const fetchNotifications = async () => {
            try {
                const response = await api.get('/api/user/notifications');
                setNotifications(response.data);
                localStorage.setItem('notifications', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching notifications from DB:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleNotificationClick = async (id) => {
        try {
          await api.put(`/api/user/notifications/${id}/read`, {}, { withCredentials: true });
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.id === id ? { ...notification, read: true } : notification
            )
          );

            //Updates local storage with read status
            const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
            const updatedNotifications = storedNotifications.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            );
            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

            //Clears live notifications
            updatedNotification(null);

            navigate('/myprofile')
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
    };


    return (
        <>
            <Navbar/>
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
                    {notifications.map((notification) => (
                        <NotificationCard key={notification.id} notification={notification} onClick={() => handleNotificationClick(notification.id)}/>
                    ))}
                </section>
            </main>
        </>
    );
}

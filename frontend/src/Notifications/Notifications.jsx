import React, {useContext, useEffect, useState} from 'react'
import './Notifications.css'
import Navbar from '../Navbar/Navbar'
import NotificationCard from './NotificationCard'
import { WebSocketContext } from '../contexts/WebSocketContext';
import api from '../api';
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../UserContext';
import HeroSection from '../HeroSection';
import Footer from '../Footer/Footer';

export default function Notifications() {
    const { updatedNotification, notification } = useContext(WebSocketContext);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate()
    const {user} = useContext(UserContext)

    useEffect(() => {

        const fetchNotifications = async () => {
            try {
                const response = await api.get('/api/user/notifications', {withCredentials: true});
                const filteredNotifications = response.data.filter(notif => notif.notificationsOn !== false);
                setNotifications(filteredNotifications);
                localStorage.setItem('notifications', JSON.stringify(filteredNotifications));
            } catch (error) {
                console.error('Error fetching notifications from DB:', error);
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        if (notification && notification.notificationsOn !== false) {
            setNotifications((prevNotifications) => [notification, ...prevNotifications]);
            const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
            storedNotifications.unshift(notification);
            localStorage.setItem('notifications', JSON.stringify(storedNotifications));
        }
    }, [notification]);

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

            if (user.role === 'physician') {
                navigate('/patients');
            } else if (user.role === 'patient') {
                navigate('/myprofile');
            }
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
    };


    return (
        <>
            <Navbar/>
            <main>
                <HeroSection title="Notifications" />
                <section className='notification-list'>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                        <NotificationCard key={notification.id} notification={notification} onClick={() => handleNotificationClick(notification.id)} />
                        ))
                    ) : (
                        <p>No notifications found.</p>
                    )}
                </section>
            </main>

            <Footer/>
        </>
    );
}

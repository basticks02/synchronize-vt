import React, {useContext, useEffect, useState} from 'react'
import './Notifications.css'
import Navbar from '../Navbar/Navbar'
import NotificationCard from './NotificationCard'
import { WebSocketContext } from '../contexts/WebSocketContext';

export default function Notifications() {
    const { updatedNotification } = useContext(WebSocketContext);
    // TODO get notifications from db
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        updatedNotification(null);
    }, []);
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
                    {notifications.map((notification, index) => (
                        <NotificationCard key={index} notification={notification} />
                    ))}
                </section>
            </main>
        </>
    );
}

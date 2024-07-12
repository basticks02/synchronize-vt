import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import Navbar from '../Navbar/Navbar';
import NotificationCard from './NotificationCard';

export default function Notifications() {
    const ws = useContext(WebSocketContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (ws) {
            ws.onmessage = (message) => {
                const data = JSON.parse(message.data);
                setNotifications((prev) => [...prev, data]);
            };
        }
    }, [ws]);

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

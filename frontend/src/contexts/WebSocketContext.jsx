import React, { createContext, useEffect, useRef, useState } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ user, children }) => {
    const [notification, setNotification] = useState(null);
    const ws = useRef(null);

    const updatedNotification = (newVal) => {
        setNotification(newVal);
        if (newVal) {
            const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
            notifications.push(newVal);
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
    };

    useEffect(() => {
        if (!user) {
            setNotification(null); 
            localStorage.setItem('notifications', JSON.stringify([]));
            return;
        }

        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (ws.current) {
            ws.current.close();
        }

        ws.current = new WebSocket(`ws://localhost:4000?token=${token}`);

        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onmessage = (message) => {
            const messageJSON = JSON.parse(message.data);
            if (messageJSON.isNotification) {
                updatedNotification(messageJSON);
            }
            console.log('WebSocket message received:', message);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [user]);

    return (
        <WebSocketContext.Provider value={{ notification, updatedNotification }}>
            {children}
        </WebSocketContext.Provider>
    );
};

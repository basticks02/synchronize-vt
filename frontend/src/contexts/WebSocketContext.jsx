import React, { createContext, useEffect, useRef, useState } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ user, children }) => {
    const [notification, setNotification] = useState(null)
    const ws = useRef(null);

    const updatedNotification = (newVal) => {
        setNotification(newVal)
    }

    useEffect(() => {
        if(!user) return
        console.log('mounting');
        ws.current = new WebSocket('ws://localhost:4000');

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
            const messageJSON = JSON.parse(message.data)
            if(messageJSON.isNotification) {
                setNotification(messageJSON)
            }
            console.log('WebSocket message received:', message);
        };

        return () => {
            console.log('Calling cleanup');
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [user]);

    return (
        <WebSocketContext.Provider value={{notification, updatedNotification} }>
            {children}
        </WebSocketContext.Provider>
    );
};

import './Navbar.css'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../UserContext'
import api from '../api'
import { WebSocketContext } from '../contexts/WebSocketContext'

export default function Navbar() {
  const { user, updateUser } = useContext(UserContext);
  const { notification } = useContext(WebSocketContext);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/api/user/notifications', { withCredentials: true });
        const notifications = response.data;
        const unreadNotifications = notifications.filter((n) => !n.read);
        setUnreadNotifications(unreadNotifications);
        localStorage.setItem('notifications', JSON.stringify(notifications));
      } catch (error) {
        console.error('Error fetching notifications from DB:', error);
        localStorage.setItem('notifications', JSON.stringify([]))
      }
    };

    if (user) {
      fetchNotifications();
    } else {
      setUnreadNotifications([]);
      localStorage.setItem('notifications', JSON.stringify([]));
    }
  }, [user]);

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const unreadNotifications = storedNotifications.filter((n) => !n.read);
    setUnreadNotifications(unreadNotifications);
  }, [notification]);

  const handleLogout = async () => {
    try {
      await api.post('/api/user/logout', {}, { withCredentials: true });
      updateUser(null);
      setUnreadNotifications([])
      localStorage.removeItem('notifications');
      navigate('/');
      alert("Successfully Logged Out")
    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
    }
  };

  const getNotificationDisplay = () => {
    if (unreadNotifications.length === 1) {
      const unreadNotification = unreadNotifications[0];
      const notificationText = unreadNotification.message
        ? unreadNotification.message.slice(0, 10)
        : unreadNotification.content
          ? unreadNotification.content.slice(0, 10)
          : '';
      return `1 ${notificationText}`;
    } else if (unreadNotifications.length > 1) {
      return `${unreadNotifications.length}`;
    }
    return null;
  };


  return (
    <nav className='navbar'>
      {user ? (
        <>
          <Link to="/" onClick={handleLogout}>Sign Out</Link>
          <Link to="/">Home</Link>
          {user.role === 'patient' && <Link to="/myprofile">My Profile</Link>}
          {user.role !== 'patient' && <Link to="/patients">Patients</Link>}
          <Link to="/notifications">Notifications
            {unreadNotifications.length > 0 ? (
              <span className="notificationAlert">{getNotificationDisplay()}</span>
            ) : null}
          </Link>
          <Link to="/discover">Discover</Link>
        </>
      ) : (
        <>
          <Link to="/login">Sign In</Link>
          <Link to="/">Home</Link>
          <Link to="/discover">Discover</Link>
        </>
      )}

    </nav>
  )
}

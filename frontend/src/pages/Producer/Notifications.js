import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import API from '../../services/api';
import '../Producer/ProducerLayout.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await API.put(`/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await API.put('/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'white', margin: 0 }}>Notifications</h1>
                <button onClick={markAllAsRead} className="btn-primary">
                    <CheckCheck size={16} style={{ display: 'inline', marginRight: '5px' }} />
                    Mark All Read
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="form-section">
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>No notifications yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {notifications.map(notif => (
                        <div
                            key={notif._id}
                            style={{
                                background: notif.read ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                                padding: '20px',
                                borderRadius: '12px',
                                border: `1px solid ${notif.read ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`,
                                cursor: 'pointer'
                            }}
                            onClick={() => !notif.read && markAsRead(notif._id)}
                        >
                            <div style={{ display: 'flex', alignItems: 'start', gap: '15px' }}>
                                <Bell size={20} color="white" />
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: 'white', margin: '0 0 5px 0', fontWeight: notif.read ? 'normal' : 'bold' }}>
                                        {notif.message}
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '12px' }}>
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {!notif.read && (
                                    <div style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: '#4CAF50'
                                    }} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;

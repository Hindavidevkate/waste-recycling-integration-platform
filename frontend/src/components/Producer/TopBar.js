import React, { useState, useEffect } from 'react';
import { LogOut, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import '../../pages/Producer/ProducerLayout.css';

const TopBar = () => {
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Producer' };
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchUnreadCount();
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const unread = res.data.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <div className="producer-topbar">
            <div className="topbar-title">Welcome Back!</div>
            <div className="topbar-user">
                <div className="notification-badge" onClick={() => navigate('/producer/notifications')}>
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
                </div>
                <div className="user-avatar">
                    <User size={20} />
                </div>
                <span style={{ fontWeight: 500, fontSize: '14px' }}>{user.name}</span>
                <button
                    onClick={handleLogout}
                    style={{
                        marginLeft: '15px',
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '8px 16px',
                        borderRadius: '8px'
                    }}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default TopBar;

import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../pages/Transporter/TransporterLayout.css';

const TopBar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="transporter-topbar">
            <h2>Welcome, {user.name || 'Transporter'}!</h2>
            <div className="topbar-actions">
                <button className="icon-btn" title="Notifications">
                    <Bell size={20} />
                </button>
                <button className="icon-btn" title="Profile">
                    <User size={20} />
                </button>
                <button className="icon-btn" onClick={handleLogout} title="Logout">
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export default TopBar;

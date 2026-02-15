import React from 'react';
import { LogOut, User } from 'lucide-react';
import '../../pages/Admin/AdminLayout.css';

const TopBar = () => {
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <div className="admin-topbar">
            <div className="topbar-title">Overview</div>
            <div className="topbar-user">
                <div className="user-avatar">
                    <User size={20} />
                </div>
                <span style={{ fontWeight: 500, fontSize: '14px' }}>{user.name}</span>
                <button
                    onClick={handleLogout}
                    style={{
                        marginLeft: '15px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
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

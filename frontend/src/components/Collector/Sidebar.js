import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Search,
    Truck,
    History,
    User,
    LogOut,
    Recycle
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar glass-card">
            <div className="logo-section">
                <Recycle size={32} color="#00d2ff" />
                <span>Kabadiwala</span>
            </div>

            <nav className="nav-links">
                <NavLink to="/kabadiwala" end className={({ isActive }) => isActive ? 'active' : ''}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/kabadiwala/browse" className={({ isActive }) => isActive ? 'active' : ''}>
                    <Search size={20} />
                    <span>Browse Waste</span>
                </NavLink>
                <NavLink to="/kabadiwala/my-collections" className={({ isActive }) => isActive ? 'active' : ''}>
                    <Truck size={20} />
                    <span>My Collections</span>
                </NavLink>
                <NavLink to="/kabadiwala/history" className={({ isActive }) => isActive ? 'active' : ''}>
                    <History size={20} />
                    <span>History</span>
                </NavLink>
                <NavLink to="/kabadiwala/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                    <User size={20} />
                    <span>Profile</span>
                </NavLink>
            </nav>

            <button className="logout-btn" onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
            }}>
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;

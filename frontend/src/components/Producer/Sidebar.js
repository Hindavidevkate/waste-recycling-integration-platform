import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plus, Package, History, Bell, User, Recycle } from 'lucide-react';
import '../../pages/Producer/ProducerLayout.css';

const Sidebar = () => {
    return (
        <div className="producer-sidebar">
            <div className="sidebar-logo">
                <Recycle size={28} />
                <span>Producer Portal</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/producer" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/producer/create" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Plus size={20} />
                    <span>Create Listing</span>
                </NavLink>
                <NavLink to="/producer/listings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Package size={20} />
                    <span>My Listings</span>
                </NavLink>
                <NavLink to="/producer/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <History size={20} />
                    <span>History</span>
                </NavLink>
                <NavLink to="/producer/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Bell size={20} />
                    <span>Notifications</span>
                </NavLink>
                <NavLink to="/producer/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <User size={20} />
                    <span>Profile</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;

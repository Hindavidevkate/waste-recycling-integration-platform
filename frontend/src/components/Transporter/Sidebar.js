import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Package, History, DollarSignIcon as DollarSign, Truck, User } from 'lucide-react';
import '../../pages/Transporter/TransporterLayout.css';

const Sidebar = () => {
    return (
        <div className="transporter-sidebar">
            <div className="sidebar-logo">
                <Truck size={28} />
                <span>Transporter Hub</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/transporter" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/transporter/browse" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Search size={20} />
                    <span>Browse Jobs</span>
                </NavLink>
                <NavLink to="/transporter/my-jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Package size={20} />
                    <span>My Jobs</span>
                </NavLink>
                <NavLink to="/transporter/fleet" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Truck size={20} />
                    <span>Fleet</span>
                </NavLink>
                <NavLink to="/transporter/earnings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <DollarSign size={20} />
                    <span>Earnings</span>
                </NavLink>
                <NavLink to="/transporter/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <History size={20} />
                    <span>History</span>
                </NavLink>
                <NavLink to="/transporter/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <User size={20} />
                    <span>Profile</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Truck, Factory, Trash2, Tag, FileText, Settings } from 'lucide-react';
import '../../pages/Admin/AdminLayout.css';

const Sidebar = () => {
    return (
        <div className="admin-sidebar">
            <div className="sidebar-logo">
                <Trash2 size={24} />
                <span>Admin Portal</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>Users</span>
                </NavLink>
                <NavLink to="/admin/collectors" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Truck size={20} />
                    <span>Collectors</span>
                </NavLink>
                <NavLink to="/admin/recyclers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Factory size={20} />
                    <span>Recyclers</span>
                </NavLink>
                <NavLink to="/admin/pickups" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Trash2 size={20} />
                    <span>Pickups</span>
                </NavLink>
                <NavLink to="/admin/categories" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Tag size={20} />
                    <span>Categories</span>
                </NavLink>
                <NavLink to="/admin/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FileText size={20} />
                    <span>Reports</span>
                </NavLink>
                <NavLink to="/admin/complaints" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>Complaints</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;

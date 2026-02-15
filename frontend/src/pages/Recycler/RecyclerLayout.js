import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './RecyclerLayout.css';

const RecyclerLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="recycler-layout">
            <aside className="recycler-sidebar">
                <div className="sidebar-header">Recycler Portal</div>
                <nav className="sidebar-nav">
                    <NavLink to="/recycler" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/recycler/browse" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        Browse Materials
                    </NavLink>
                    <NavLink to="/recycler/shipments" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        Incoming Shipments
                    </NavLink>
                    <NavLink to="/recycler/inventory" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        Inventory
                    </NavLink>
                    <NavLink to="/recycler/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        History
                    </NavLink>
                    <NavLink to="/recycler/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        Sustainability Reports
                    </NavLink>
                    <NavLink to="/recycler/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        Profile
                    </NavLink>
                </nav>
                <div style={{ marginTop: 'auto' }}>
                    <button onClick={handleLogout} className="nav-item" style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="recycler-main">
                <header className="top-bar">
                    <h2>Welcome, {user?.name || 'Recycler'}</h2>
                    <div className="user-info">
                        <div className="user-avatar">{user?.name?.charAt(0) || 'R'}</div>
                        <span>{user?.facilityType || 'Recycling Facility'}</span>
                    </div>
                </header>
                <Outlet />
            </main>
        </div>
    );
};

export default RecyclerLayout;

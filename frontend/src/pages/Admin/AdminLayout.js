import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar';
import TopBar from '../../components/Admin/TopBar';
import './AdminLayout.css';

const AdminLayout = () => {
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <TopBar />
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

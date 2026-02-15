import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Transporter/Sidebar';
import TopBar from '../../components/Transporter/TopBar';
import './TransporterLayout.css';

const TransporterLayout = () => {
    return (
        <div className="transporter-layout">
            <Sidebar />
            <div className="transporter-main">
                <TopBar />
                <div className="transporter-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default TransporterLayout;

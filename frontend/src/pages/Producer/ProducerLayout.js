import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Producer/Sidebar';
import TopBar from '../../components/Producer/TopBar';
import './ProducerLayout.css';

const ProducerLayout = () => {
    return (
        <div className="producer-layout">
            <Sidebar />
            <div className="producer-main">
                <TopBar />
                <div className="producer-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ProducerLayout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Collector/Sidebar';
import './KabadiwalaLayout.css';

const KabadiwalaLayout = () => {
    return (
        <div className="kabadiwala-layout">
            <Sidebar />
            <div className="kabadiwala-main">
                <header style={{
                    padding: '20px 30px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div className="user-profile-mini" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>
                                {JSON.parse(localStorage.getItem('user'))?.name || 'Kabadiwala'}
                            </p>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Verified Collector</span>
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>
                            {JSON.parse(localStorage.getItem('user'))?.name?.charAt(0) || 'K'}
                        </div>
                    </div>
                </header>
                <div className="kabadiwala-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default KabadiwalaLayout;

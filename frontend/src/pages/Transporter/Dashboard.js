import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, DollarSign, Star } from 'lucide-react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './TransporterLayout.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEarnings: 0,
        monthlyEarnings: 0,
        completedJobs: 0,
        totalJobs: 0,
        rating: 0
    });
    const [activeJobs, setActiveJobs] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchActiveJobs();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/transporters/earnings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchActiveJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/transporters/jobs/my-jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveJobs(res.data.slice(0, 5));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3><DollarSign size={18} style={{ display: 'inline', marginRight: '8px' }} />Total Earnings</h3>
                    <p className="value">₹{stats.totalEarnings}</p>
                </div>
                <div className="stat-card">
                    <h3><TrendingUp size={18} style={{ display: 'inline', marginRight: '8px' }} />This Month</h3>
                    <p className="value">₹{stats.monthlyEarnings}</p>
                </div>
                <div className="stat-card">
                    <h3><Package size={18} style={{ display: 'inline', marginRight: '8px' }} />Completed Jobs</h3>
                    <p className="value">{stats.completedJobs}/{stats.totalJobs}</p>
                </div>
                <div className="stat-card">
                    <h3><Star size={18} style={{ display: 'inline', marginRight: '8px' }} />Rating</h3>
                    <p className="value">{stats.rating.toFixed(1)}⭐</p>
                </div>
            </div>

            <div className="form-section">
                <h2>Active Jobs</h2>
                {activeJobs.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>No active jobs. <button className="btn-primary" onClick={() => navigate('/transporter/browse')}>Browse Jobs</button></p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {activeJobs.map(job => (
                            <div key={job._id} style={{
                                background: 'rgba(255,255,255,0.1)',
                                padding: '15px',
                                borderRadius: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ color: 'white', margin: '0 0 5px 0' }}>{job.wasteType}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '14px' }}>
                                        {job.estimatedWeight}kg • ₹{job.price} • {job.address}
                                    </p>
                                </div>
                                <span className={`badge badge-${job.deliveryStatus || 'pending'}`}>{job.deliveryStatus || 'pending'}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

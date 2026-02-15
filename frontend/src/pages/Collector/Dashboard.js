import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, Truck, Wallet, Clock, CheckCircle } from 'lucide-react';
import API from '../../services/api';
import './KabadiwalaLayout.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalCollections: 0,
        inProgress: 0,
        totalWeight: 0,
        earnings: 0
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Mocking stats for now, real implementation would fetch from API
        // In a real scenario, we'd add a /collectors/stats endpoint
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/pickups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter pickups where this user is the buyer
            const myCollections = res.data.filter(p => p.buyerId === user.userId);

            setStats({
                totalCollections: myCollections.length,
                inProgress: myCollections.filter(p => ['awaiting-transport', 'accepted'].includes(p.status)).length,
                totalWeight: myCollections.reduce((sum, p) => sum + (p.estimatedWeight || 0), 0),
                earnings: myCollections.reduce((sum, p) => sum + (p.price || 0), 0)
            });
            setRecentJobs(myCollections.slice(0, 5));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-view">
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ marginBottom: '10px', fontSize: '2.4rem', fontWeight: 800 }}>Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}! Here's what's happening today.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '15px', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '15px' }}>
                        <Truck size={30} color="var(--primary-color)" />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Collections</p>
                        <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{stats.totalCollections}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '15px', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '15px' }}>
                        <TrendingUp size={30} color="var(--accent-color)" />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Weight (kg)</p>
                        <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{stats.totalWeight}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '15px', background: 'rgba(255, 193, 7, 0.1)', borderRadius: '15px' }}>
                        <Clock size={30} color="#ffc107" />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>In Progress</p>
                        <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{stats.inProgress}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '15px', background: 'rgba(58, 123, 213, 0.1)', borderRadius: '15px' }}>
                        <Wallet size={30} color="var(--secondary-color)" />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Spent</p>
                        <h3 style={{ margin: 0, fontSize: '1.8rem' }}>₹{stats.earnings}</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <h3 style={{ margin: 0 }}>Active Collections</h3>
                        <button className="btn-premium" style={{ padding: '8px 15px', fontSize: '0.8rem' }}>View All</button>
                    </div>
                    {recentJobs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed var(--glass-border)', borderRadius: '15px' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No active collections found.</p>
                            <button className="btn-premium" style={{ marginTop: '10px' }}>Explore Marketplace</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {recentJobs.map(job => (
                                <div key={job._id} style={{
                                    padding: '15px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{job.wasteType}</h4>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.address}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`badge badge-${job.status}`}>{job.status}</span>
                                        <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>{job.estimatedWeight}kg</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass-card">
                    <h3 style={{ marginBottom: '25px' }}>Quick Stats</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <CheckCircle size={18} color="var(--accent-color)" />
                                <span>Completion Rate</span>
                            </div>
                            <span style={{ fontWeight: 600 }}>85%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '85%', background: 'var(--accent-color)', borderRadius: '3px' }}></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Package size={18} color="var(--primary-color)" />
                                <span>Verified Listings</span>
                            </div>
                            <span style={{ fontWeight: 600 }}>12</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '60%', background: 'var(--primary-color)', borderRadius: '3px' }}></div>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '40px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1), rgba(58, 123, 213, 0.1))',
                        borderRadius: '15px',
                        border: '1px solid rgba(0, 210, 255, 0.2)'
                    }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Tip of the day</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--text-muted)' }}>
                            High-quality photos increase the chances of faster transporter bidding. Encourage producers to upload clear images!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

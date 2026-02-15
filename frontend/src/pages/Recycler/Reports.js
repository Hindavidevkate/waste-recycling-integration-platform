import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecyclerLayout.css';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/recyclers/stats/${user.id}`);
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, [user.id]);

    return (
        <div className="reports">
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h3>Sustainability & Compliance Report</h3>
                <p style={{ color: 'var(--text-muted)' }}>Environmental impact tracking based on processed waste.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="glass-card">
                    <h4>Carbon Offset</h4>
                    <p style={{ fontSize: '2rem', margin: '1rem 0', color: '#4caf50' }}>
                        {(stats?.totalMaterials * 1.5).toFixed(2)} kg CO2e
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated carbon emissions avoided through recycling.</p>
                </div>

                <div className="glass-card">
                    <h4>Resource Recovery</h4>
                    <div style={{ marginTop: '1.5rem' }}>
                        {stats?.materialGroups?.map(group => (
                            <div key={group._id} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                    <span>{group._id}</span>
                                    <span>{group.total} kg</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(group.total / stats.totalMaterials) * 100}%`,
                                        height: '100%',
                                        background: 'var(--primary-color)'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button className="glass-card" style={{ marginTop: '2rem', width: '100%', textAlign: 'center', cursor: 'pointer', borderStyle: 'dashed' }}>
                + Generate New Compliance Certificate
            </button>
        </div>
    );
};

export default Reports;

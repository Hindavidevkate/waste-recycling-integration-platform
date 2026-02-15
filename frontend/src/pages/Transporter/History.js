import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import './TransporterLayout.css';

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/transporters/jobs/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>Job History</h1>

            {history.length === 0 ? (
                <div className="form-section">
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>No completed jobs recorded.</p>
                </div>
            ) : (
                <div className="jobs-grid">
                    {history.map(job => (
                        <div key={job._id} className="job-card">
                            <h3>{job.wasteType}</h3>
                            <p className="job-detail">📍 {job.address}</p>
                            <p className="job-detail">⚖️ {job.estimatedWeight} kg</p>
                            <p className="job-detail">💰 ₹{job.price}</p>
                            <p className="job-detail">📅 {new Date(job.updatedAt).toLocaleDateString()}</p>
                            <span className={`badge badge-${job.status}`}>
                                {job.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecyclerLayout.css';

const ProcurementHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/recyclers/shipments/${user.id}`);
                // Filter for completed only for history
                setHistory(res.data.filter(s => s.status === 'completed'));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user.id]);

    return (
        <div className="procurement-history">
            <div className="glass-card">
                <h3>Procurement History</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>View all your completed purchases and deliveries.</p>

                {loading ? (
                    <p>Loading history...</p>
                ) : (
                    <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {history.map(item => (
                            <div key={item._id} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4>{item.wasteType}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Weight: {item.estimatedWeight} kg | Date: {new Date(item.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>₹{item.price}</p>
                                    <p style={{ fontSize: '0.8rem', color: '#4caf50' }}>Completed</p>
                                </div>
                            </div>
                        ))}
                        {history.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No completed procurements yet.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProcurementHistory;

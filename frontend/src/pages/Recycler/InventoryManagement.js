import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecyclerLayout.css';

const InventoryManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/recyclers/inventory/${user.id}`);
                setInventory(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, [user.id]);

    return (
        <div className="inventory">
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Facility Inventory</h3>
                    <button style={{ padding: '0.5rem 1rem', background: 'var(--primary-color)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>
                        Export CSV
                    </button>
                </div>

                {loading ? (
                    <p>Loading inventory...</p>
                ) : (
                    <div className="table-container" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>Material</th>
                                    <th style={{ padding: '1rem' }}>Quantity (kg)</th>
                                    <th style={{ padding: '1rem' }}>Quality</th>
                                    <th style={{ padding: '1rem' }}>Received Date</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem' }}>{item.materialType}</td>
                                        <td style={{ padding: '1rem' }}>{item.quantity}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                background: 'rgba(255,255,255,0.1)'
                                            }}>
                                                {item.quality}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{new Date(item.receivedDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ color: item.status === 'In Stock' ? '#4caf50' : '#94a3b8' }}>{item.status}</span>
                                        </td>
                                    </tr>
                                ))}
                                {inventory.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Inventory is empty.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryManagement;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecyclerLayout.css';

const IncomingShipments = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchShipments = React.useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/recyclers/shipments/${user.id}`);
            setShipments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        fetchShipments();
    }, [fetchShipments]);

    const handleInspect = async (id, quality) => {
        const notes = prompt('Enter inspection notes:');
        try {
            await axios.patch(`http://localhost:5000/api/recyclers/inspect/${id}`, {
                quality,
                notes,
                recyclerId: user.id
            });
            alert('Inspection completed and material added to inventory!');
            fetchShipments();
        } catch (err) {
            console.error(err);
            alert('Inspection failed');
        }
    };

    return (
        <div className="shipments">
            <div className="glass-card">
                <h3>Incoming Shipments</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Track waste deliveries and perform quality checks.</p>

                {loading ? (
                    <p>Loading shipments...</p>
                ) : (
                    <div className="shipment-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {shipments.map(shipment => (
                            <div key={shipment._id} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4>{shipment.wasteType} - {shipment.estimatedWeight} kg</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>From: {shipment.userId?.name} | Transporter: {shipment.transporterId?.name || 'Assigned'}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`status-badge ${shipment.deliveryStatus}`} style={{
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            background: shipment.deliveryStatus === 'delivered' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                                            color: shipment.deliveryStatus === 'delivered' ? '#4caf50' : '#ff9800'
                                        }}>
                                            {shipment.deliveryStatus}
                                        </span>
                                        <div style={{ marginTop: '0.5rem' }}>
                                            {shipment.deliveryStatus === 'delivered' && shipment.status !== 'completed' && (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => handleInspect(shipment._id, 'High')} style={{ padding: '0.3rem 0.6rem', background: '#4caf50', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>High Qlty</button>
                                                    <button onClick={() => handleInspect(shipment._id, 'Medium')} style={{ padding: '0.3rem 0.6rem', background: '#ff9800', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>Medium</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {shipments.length === 0 && <p>No incoming shipments found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncomingShipments;

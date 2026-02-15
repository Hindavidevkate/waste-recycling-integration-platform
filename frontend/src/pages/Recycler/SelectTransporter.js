import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Truck, Star, MapPin, CheckCircle, Package } from 'lucide-react';
import './RecyclerLayout.css';

const SelectTransporter = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transporters, setTransporters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pickup, setPickup] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [transRes, pickupRes] = await Promise.all([
                API.get('/transporters', { headers: { Authorization: `Bearer ${token}` } }),
                API.get('/pickups', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setTransporters(transRes.data);
            const currentPickup = pickupRes.data.find(p => p._id === id);
            setPickup(currentPickup);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (transporterId) => {
        if (!window.confirm('Assign this transporter to your collection?')) return;
        try {
            const token = localStorage.getItem('token');
            await API.patch(`/pickups/${id}/assign-transporter`, { transporterId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Transporter assigned successfully!');
            navigate('/recycler/shipments');
        } catch (err) {
            alert(err.response?.data?.message || 'Error assigning transporter');
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>Loading available transporters...</div>;

    return (
        <div className="select-transporter" style={{ padding: '20px' }}>
            <div className="glass-card" style={{ marginBottom: '30px', background: 'rgba(0, 210, 255, 0.1)' }}>
                <h2 style={{ color: 'white', marginBottom: '15px' }}>Step 2: Assign Transporter</h2>
                {pickup && (
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package color="#00d2ff" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'white' }}>{pickup.wasteType}</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{pickup.address}</p>
                        </div>
                    </div>
                )}
            </div>

            <h3 style={{ color: 'white', marginBottom: '20px' }}>Available Transporters Near You</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {transporters.map(trans => (
                    <div key={trans._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {trans.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: 'white' }}>{trans.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ffc107', fontSize: '0.85rem' }}>
                                        <Star size={14} fill="#ffc107" /> {trans.rating?.toFixed(1) || 'NEW'}
                                        <span style={{ color: 'var(--text-muted)' }}>({trans.completedJobs || 0} jobs)</span>
                                    </div>
                                </div>
                            </div>
                            <span style={{ padding: '4px 10px', background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
                                {trans.vehicleType || 'Truck'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Truck size={14} color="var(--primary-color)" /> {trans.vehicleNumber || 'N/A'}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={14} color="var(--primary-color)" /> {trans.currentLocation?.address || 'Location unknown'}
                            </p>
                        </div>

                        <button
                            onClick={() => handleAssign(trans._id)}
                            className="btn-premium"
                            style={{ width: '100%', marginTop: 'auto' }}
                        >
                            <CheckCircle size={18} /> Select Transporter
                        </button>
                    </div>
                ))}
                {transporters.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No transporters available at the moment.</p>}
            </div>
        </div>
    );
};

export default SelectTransporter;

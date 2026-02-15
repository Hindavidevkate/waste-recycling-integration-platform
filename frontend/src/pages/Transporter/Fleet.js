import React, { useState, useEffect } from 'react';
import { Truck, Plus, Trash2 } from 'lucide-react';
import API from '../../services/api';
import './TransporterLayout.css';

const Fleet = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        vehicleType: '',
        vehicleNumber: '',
        capacity: '',
        fuelType: 'Diesel',
        mileage: ''
    });

    const fetchVehicles = React.useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/vehicles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVehicles(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handleSublimit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await API.post('/vehicles', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Vehicle added successfully!');
            setShowModal(false);
            setFormData({
                vehicleType: '',
                vehicleNumber: '',
                capacity: '',
                fuelType: 'Diesel',
                mileage: ''
            });
            fetchVehicles();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add vehicle');
        }
    };

    const deleteVehicle = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            const token = localStorage.getItem('token');
            await API.delete(`/vehicles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchVehicles();
        } catch (err) {
            alert('Failed to delete vehicle');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'white', margin: 0 }}>Fleet Management</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={16} style={{ display: 'inline', marginRight: '5px' }} />
                    Add Vehicle
                </button>
            </div>

            {vehicles.length === 0 ? (
                <div className="form-section">
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>No vehicles registered in your fleet.</p>
                </div>
            ) : (
                <div className="stats-grid">
                    {vehicles.map(v => (
                        <div key={v._id} className="stat-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3><Truck size={18} style={{ display: 'inline', marginRight: '8px' }} />{v.vehicleType}</h3>
                                <div>
                                    <button onClick={() => deleteVehicle(v._id)} style={{ background: 'none', border: 'none', color: '#F44336', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="value" style={{ fontSize: '24px', margin: '5px 0' }}>{v.vehicleNumber}</p>
                            <p className="job-detail">⚖️ Capacity: {v.capacity} kg</p>
                            <p className="job-detail">⛽ Fuel: {v.fuelType}</p>
                            <span className={`badge badge-${v.status}`}>{v.status}</span>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="form-section" style={{ maxWidth: '500px', width: '90%' }}>
                        <h2>Add New Vehicle</h2>
                        <form onSubmit={handleSublimit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input
                                className="form-input"
                                placeholder="Vehicle Type (e.g. Truck, Van)"
                                value={formData.vehicleType}
                                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                required
                            />
                            <input
                                className="form-input"
                                placeholder="Vehicle Number"
                                value={formData.vehicleNumber}
                                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Capacity (kg)"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                required
                            />
                            <select
                                className="form-select"
                                value={formData.fuelType}
                                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                            >
                                <option value="Diesel">Diesel</option>
                                <option value="Petrol">Petrol</option>
                                <option value="CNG">CNG</option>
                                <option value="Electric">Electric</option>
                            </select>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Mileage (km/l)"
                                value={formData.mileage}
                                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                            />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" className="btn-primary">Add Vehicle</button>
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fleet;

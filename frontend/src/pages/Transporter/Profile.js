import React, { useState, useEffect } from 'react';
import { Save, User, Truck, FileText } from 'lucide-react';
import API from '../../services/api';
import './TransporterLayout.css';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        vehicleType: '',
        vehicleNumber: '',
        licenseNumber: '',
        capacity: '',
        licenseExpiry: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data;
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                vehicleType: data.vehicleType || '',
                vehicleNumber: data.vehicleNumber || '',
                licenseNumber: data.licenseNumber || '',
                capacity: data.capacity || '',
                licenseExpiry: data.licenseExpiry ? data.licenseExpiry.split('T')[0] : ''
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            await API.put(`/admin/users/${user.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile');
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>Transporter Profile</h1>

            <div className="form-section">
                <form onSubmit={handleSubmit}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={20} /> Personal Information
                    </h3>
                    <div className="form-grid">
                        <input className="form-input" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                        <input className="form-input" name="email" value={formData.email} disabled />
                        <input className="form-input" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                    </div>

                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
                        <Truck size={20} /> Primary Vehicle Information
                    </h3>
                    <div className="form-grid">
                        <input className="form-input" name="vehicleType" placeholder="Vehicle Type (e.g. Van)" value={formData.vehicleType} onChange={handleChange} />
                        <input className="form-input" name="vehicleNumber" placeholder="Vehicle Number" value={formData.vehicleNumber} onChange={handleChange} />
                        <input className="form-input" type="number" name="capacity" placeholder="Capacity (kg)" value={formData.capacity} onChange={handleChange} />
                    </div>

                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
                        <FileText size={20} /> License & Compliance
                    </h3>
                    <div className="form-grid">
                        <input className="form-input" name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} />
                        <div className="filter-group">
                            <label style={{ color: 'white', marginBottom: '5px' }}>License Expiry</label>
                            <input className="form-input" type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} />
                        </div>
                    </div>

                    <textarea className="form-textarea" name="address" placeholder="Address" value={formData.address} onChange={handleChange} rows="3" style={{ width: '100%', marginTop: '20px' }} />

                    <button type="submit" className="btn-primary" style={{ marginTop: '25px' }}>
                        <Save size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;

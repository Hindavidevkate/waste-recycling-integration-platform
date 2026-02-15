import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import API from '../../services/api';
import '../Producer/ProducerLayout.css';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        businessName: '',
        gstin: '',
        wasteGenerationCapacity: '',
        businessType: ''
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
            setFormData({
                name: res.data.name || '',
                email: res.data.email || '',
                phone: res.data.phone || '',
                address: res.data.address || '',
                businessName: res.data.businessName || '',
                gstin: res.data.gstin || '',
                wasteGenerationCapacity: res.data.wasteGenerationCapacity || '',
                businessType: res.data.businessType || ''
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

            // Update local storage
            localStorage.setItem('user', JSON.stringify({ ...user, name: formData.name }));

            alert("Profile updated successfully!");
        } catch (err) {
            alert("Failed to update profile");
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>Profile & Business Details</h1>

            <div className="form-section">
                <form onSubmit={handleSubmit}>
                    <h3 style={{ color: 'white', marginTop: 0 }}>Personal Information</h3>
                    <div className="form-grid">
                        <input
                            className="form-input"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="form-input"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled
                        />
                        <input
                            className="form-input"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <h3 style={{ color: 'white', marginTop: '25px' }}>Business Information</h3>
                    <div className="form-grid">
                        <input
                            className="form-input"
                            name="businessName"
                            placeholder="Business Name"
                            value={formData.businessName}
                            onChange={handleChange}
                        />
                        <input
                            className="form-input"
                            name="gstin"
                            placeholder="GSTIN"
                            value={formData.gstin}
                            onChange={handleChange}
                        />
                        <select
                            className="form-select"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                        >
                            <option value="">Select Business Type</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Factory">Factory</option>
                            <option value="Office">Office</option>
                            <option value="Retail">Retail</option>
                            <option value="Individual">Individual</option>
                            <option value="Other">Other</option>
                        </select>
                        <input
                            className="form-input"
                            name="wasteGenerationCapacity"
                            type="number"
                            placeholder="Waste Generation (kg/month)"
                            value={formData.wasteGenerationCapacity}
                            onChange={handleChange}
                        />
                    </div>

                    <textarea
                        className="form-textarea"
                        name="address"
                        placeholder="Business Address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        style={{ marginTop: '15px', width: '100%' }}
                    />

                    <button type="submit" className="btn-primary" style={{ marginTop: '25px' }}>
                        <Save size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        Save Profile
                    </button>
                </form>
            </div>

            <div className="form-section" style={{ marginTop: '20px' }}>
                <h3 style={{ color: 'white', marginTop: 0 }}>Compliance & Certificates</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Your waste disposal records and compliance certificates will appear here once you complete pickups.
                </p>
            </div>
        </div>
    );
};

export default Profile;

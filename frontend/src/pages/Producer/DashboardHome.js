import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, DollarSign, Clock } from 'lucide-react';
import API from '../../services/api';
import '../Producer/ProducerLayout.css';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalListings: 0,
        activeListings: 0,
        completedListings: 0,
        totalEarnings: 0
    });
    const [recentListings, setRecentListings] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchRecentListings();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/pickups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const listings = res.data;
            setStats({
                totalListings: listings.length,
                activeListings: listings.filter(l => l.status === 'pending' || l.status === 'accepted').length,
                completedListings: listings.filter(l => l.status === 'completed').length,
                totalEarnings: listings.filter(l => l.status === 'completed').reduce((sum, l) => sum + (l.price || 0), 0)
            });
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRecentListings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/pickups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecentListings(res.data.slice(0, 5));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>Dashboard Overview</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3><Package size={18} style={{ display: 'inline', marginRight: '8px' }} />Total Listings</h3>
                    <p className="value">{stats.totalListings}</p>
                </div>
                <div className="stat-card">
                    <h3><Clock size={18} style={{ display: 'inline', marginRight: '8px' }} />Active</h3>
                    <p className="value">{stats.activeListings}</p>
                </div>
                <div className="stat-card">
                    <h3><TrendingUp size={18} style={{ display: 'inline', marginRight: '8px' }} />Completed</h3>
                    <p className="value">{stats.completedListings}</p>
                </div>
                <div className="stat-card">
                    <h3><DollarSign size={18} style={{ display: 'inline', marginRight: '8px' }} />Total Earnings</h3>
                    <p className="value">₹{stats.totalEarnings}</p>
                </div>
            </div>

            <div className="form-section">
                <h2>Recent Listings</h2>
                {recentListings.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>No listings yet. Create your first listing!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {recentListings.map(listing => (
                            <div key={listing._id} style={{
                                background: 'rgba(255,255,255,0.1)',
                                padding: '15px',
                                borderRadius: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ color: 'white', margin: '0 0 5px 0' }}>{listing.wasteType}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '14px' }}>
                                        {listing.estimatedWeight}kg • ₹{listing.price}
                                    </p>
                                </div>
                                <span className={`badge badge-${listing.status}`}>{listing.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;

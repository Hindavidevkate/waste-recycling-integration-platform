import React, { useState, useEffect } from 'react';
import API, { BASE_URL } from '../../services/api';
import { Package, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './RecyclerLayout.css';

const BrowseWaste = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ wasteType: '', quantity: '', location: '' });
    const [offerData, setOfferData] = useState({ price: '', message: '', activeId: null });
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchListings = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await API.get('/recyclers/listings', { params: filters });
            setListings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    const handleDirectAccept = async (id) => {
        if (!window.confirm('Are you sure you want to accept this waste directly?')) return;
        try {
            await API.patch(`/pickups/${id}/direct-accept`);
            alert('Listing accepted successfully! Now select a transporter.');
            navigate(`/recycler/select-transporter/${id}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Error accepting listing');
        }
    };

    const handleOffer = async (id) => {
        if (!offerData.price) {
            alert('Please enter your offer price');
            return;
        }
        try {
            await API.post(`/recyclers/offer/${id}`, {
                recyclerId: user.userId,
                price: offerData.price,
                message: offerData.message
            });
            alert('Offer submitted successfully! Waiting for Producer approval.');
            setOfferData({ price: '', message: '', activeId: null });
            fetchListings();
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting offer');
        }
    };

    return (
        <div className="browse-waste">
            <h1 style={{ marginBottom: '2rem', color: 'white' }}>Available Waste Marketplace</h1>

            <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', background: 'rgba(255,255,255,0.05)' }}>
                <div className="filter-group">
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Waste Type</label>
                    <input
                        type="text"
                        placeholder="Plastic, Metal..."
                        className="glass-input"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        onChange={(e) => setFilters({ ...filters, wasteType: e.target.value })}
                    />
                </div>
                <div className="filter-group">
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Min Quantity (kg)</label>
                    <input
                        type="number"
                        className="glass-input"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        onChange={(e) => setFilters({ ...filters, quantity: e.target.value })}
                    />
                </div>
                <div className="filter-group">
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Location</label>
                    <input
                        type="text"
                        className="glass-input"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    />
                </div>
                <button onClick={fetchListings} style={{ padding: '12px 25px', background: '#00d2ff', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                    Search
                </button>
            </div>

            {loading ? (
                <p style={{ color: 'white' }}>Loading listings...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {listings.map(item => (
                        <div key={item._id} className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ position: 'relative' }}>
                                {item.images && item.images.length > 0 ? (
                                    <img
                                        src={`${BASE_URL}${item.images[0]}`}
                                        alt="Waste"
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                                        <Package size={48} color="rgba(255,255,255,0.2)" />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                                    <span style={{ padding: '5px 12px', background: 'rgba(0,210,255,0.9)', color: 'white', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {item.estimatedWeight} KG
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: '20px' }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ color: '#00d2ff', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>{item.wasteType}</span>
                                    <h3 style={{ margin: '5px 0', color: 'white' }}>{item.name}</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <MapPin size={14} /> {item.address}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Proposed Price:</span>
                                    <span style={{ color: '#00ff88', fontWeight: 800, fontSize: '1.2rem' }}>₹{item.price}</span>
                                </div>

                                {offerData.activeId === item._id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <input
                                            type="number"
                                            placeholder="Your Price (₹)"
                                            className="glass-input"
                                            value={offerData.price}
                                            onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}
                                        />
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleOffer(item._id)}
                                                style={{ flex: 1, padding: '10px', background: '#00d2ff', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600 }}
                                            >
                                                Send Offer
                                            </button>
                                            <button
                                                onClick={() => setOfferData({ price: '', message: '', activeId: null })}
                                                style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <button
                                            onClick={() => handleDirectAccept(item._id)}
                                            style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            <CheckCircle size={18} /> Direct Accept
                                        </button>
                                        <button
                                            onClick={() => setOfferData({ ...offerData, activeId: item._id, price: item.price })}
                                            style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(0,210,255,0.3)', borderRadius: '10px', color: '#00d2ff', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            Negotiate Price <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {listings.length === 0 && <p style={{ color: 'white' }}>No materials matching your criteria.</p>}
                </div>
            )}
        </div>
    );
};

export default BrowseWaste;


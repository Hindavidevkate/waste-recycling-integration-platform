import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import API, { BASE_URL } from '../../services/api';
import '../Producer/ProducerLayout.css';

const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [selectedListing, setSelectedListing] = useState(null);
    const [bids, setBids] = useState([]);
    const [offers, setOffers] = useState([]);
    const [showBidsModal, setShowBidsModal] = useState(false);
    const [showOffersModal, setShowOffersModal] = useState(false);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/pickups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const viewBids = async (listing) => {
        setSelectedListing(listing);
        try {
            const token = localStorage.getItem('token');
            const res = await API.get(`/bids/${listing._id}`, { // Path follows server.js mapping
                headers: { Authorization: `Bearer ${token}` }
            });
            setBids(res.data);
            setShowBidsModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    const viewOffers = async (listing) => {
        setSelectedListing(listing);
        try {
            const token = localStorage.getItem('token');
            const res = await API.get(`/pickups/${listing._id}/offers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOffers(res.data);
            setShowOffersModal(true);
        } catch (err) {
            alert("Failed to fetch offers");
            console.error(err);
        }
    };

    const acceptOffer = async (offerId) => {
        try {
            const token = localStorage.getItem('token');
            await API.patch(`/pickups/${selectedListing._id}/accept-offer/${offerId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Deal accepted! Now Transporters can bid for this job.");
            setShowOffersModal(false);
            fetchListings();
        } catch (err) {
            alert("Failed to accept deal");
            console.error(err);
        }
    };

    const acceptBid = async (bidId) => {
        try {
            const token = localStorage.getItem('token');
            await API.put(`/bids/${bidId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Bid accepted successfully!");
            setShowBidsModal(false);
            fetchListings();
        } catch (err) {
            alert("Failed to accept bid");
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>My Listings</h1>

            {listings.length === 0 ? (
                <div className="form-section">
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>No listings yet. Create your first listing!</p>
                </div>
            ) : (
                <div className="listings-grid">
                    {listings.map(listing => (
                        <div key={listing._id} className="listing-card">
                            {listing.images && listing.images.length > 0 && (
                                <img
                                    src={`${BASE_URL}${listing.images[0]}`}
                                    alt="Waste"
                                    className="listing-image"
                                />
                            )}
                            <div className="listing-content">
                                <h3 className="listing-title">{listing.wasteType}</h3>
                                <p className="listing-detail">📍 {listing.address}</p>
                                <p className="listing-detail">⚖️ {listing.estimatedWeight} kg</p>
                                <p className="listing-detail">💰 ₹{listing.price}</p>
                                <p className="listing-detail">📅 {new Date(listing.date).toLocaleDateString()}</p>
                                <span className={`badge badge-${listing.status}`}>{listing.status}</span>

                                {listing.status === 'pending' && (
                                    <button
                                        onClick={() => viewOffers(listing)}
                                        className="btn-primary"
                                        style={{ marginTop: '15px', width: '100%', background: '#ff9800' }}
                                    >
                                        <Eye size={16} style={{ display: 'inline', marginRight: '5px' }} />
                                        View Recycler Offers
                                    </button>
                                )}

                                {listing.status === 'awaiting-transport' && (
                                    <button
                                        onClick={() => viewBids(listing)}
                                        className="btn-primary"
                                        style={{ marginTop: '15px', width: '100%' }}
                                    >
                                        <Eye size={16} style={{ display: 'inline', marginRight: '5px' }} />
                                        View Transporter Bids
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Recycler Offers Modal */}
            {showOffersModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #FF9800 0%, #F44336 100%)',
                        padding: '30px',
                        borderRadius: '15px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ color: 'white', marginTop: 0 }}>Recycler Deals for {selectedListing?.wasteType}</h2>

                        {offers.length === 0 ? (
                            <p style={{ color: 'rgba(255,255,255,0.8)' }}>No offers yet from recyclers.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {offers.map(offer => (
                                    <div key={offer._id} style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        padding: '20px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}>
                                        <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>
                                            {offer.recyclerId?.name || 'Recycler'}
                                        </h3>
                                        <p style={{ color: 'rgba(255,255,255,0.9)', margin: '5px 0' }}>
                                            💰 Offer Amount: ₹{offer.price}
                                        </p>
                                        {offer.message && (
                                            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '10px 0', fontSize: '14px' }}>
                                                "{offer.message}"
                                            </p>
                                        )}
                                        {offer.status === 'pending' && (
                                            <button
                                                onClick={() => acceptOffer(offer._id)}
                                                className="btn-primary"
                                                style={{ marginTop: '10px', background: 'white', color: '#F44336', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
                                            >
                                                <CheckCircle size={16} style={{ display: 'inline', marginRight: '5px' }} />
                                                Accept Deal
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowOffersModal(false)}
                            style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.2)', color: 'white' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Bids Modal */}
            {showBidsModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '30px',
                        borderRadius: '15px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ color: 'white', marginTop: 0 }}>Transporter Bids for {selectedListing?.wasteType}</h2>

                        {bids.length === 0 ? (
                            <p style={{ color: 'rgba(255,255,255,0.8)' }}>No bids yet from transporters.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {bids.map(bid => (
                                    <div key={bid._id} style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        padding: '20px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}>
                                        <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>
                                            {bid.transporterId?.name || 'Transporter'}
                                        </h3>
                                        <p style={{ color: 'rgba(255,255,255,0.9)', margin: '5px 0' }}>
                                            💰 Bid Amount: ₹{bid.price}
                                        </p>
                                        {bid.message && (
                                            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '10px 0', fontSize: '14px' }}>
                                                "{bid.message}"
                                            </p>
                                        )}
                                        {bid.status === 'pending' && (
                                            <button
                                                onClick={() => acceptBid(bid._id)}
                                                className="btn-primary"
                                                style={{ marginTop: '10px', background: 'white', color: '#764ba2', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
                                            >
                                                <CheckCircle size={16} style={{ display: 'inline', marginRight: '5px' }} />
                                                Accept Bid
                                            </button>
                                        )}
                                        {bid.status === 'accepted' && (
                                            <span style={{ display: 'inline-block', background: '#4caf50', color: 'white', padding: '5px 10px', borderRadius: '5px', marginTop: '10px' }}>Accepted</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowBidsModal(false)}
                            style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.2)', color: 'white' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyListings;

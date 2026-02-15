import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import API from '../../services/api';
import '../Producer/ProducerLayout.css';

const History = () => {
    const [completedListings, setCompletedListings] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/pickups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const completed = res.data.filter(p => p.status === 'completed');
            setCompletedListings(completed);
        } catch (err) {
            console.error(err);
        }
    };

    const openReviewModal = (pickup) => {
        setSelectedPickup(pickup);
        setShowReviewModal(true);
    };

    const submitReview = async () => {
        try {
            const token = localStorage.getItem('token');
            await API.post('/reviews', {
                pickupId: selectedPickup._id,
                rating,
                comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Review submitted successfully!");
            setShowReviewModal(false);
            setRating(0);
            setComment('');
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit review");
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>Pickup History</h1>

            {completedListings.length === 0 ? (
                <div className="form-section">
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>No completed pickups yet.</p>
                </div>
            ) : (
                <div className="listings-grid">
                    {completedListings.map(pickup => (
                        <div key={pickup._id} className="listing-card">
                            {pickup.images && pickup.images.length > 0 && (
                                <img
                                    src={`${API.defaults.baseURL}${pickup.images[0]}`}
                                    alt="Waste"
                                    className="listing-image"
                                />
                            )}
                            <div className="listing-content">
                                <h3 className="listing-title">{pickup.wasteType}</h3>
                                <p className="listing-detail">⚖️ {pickup.estimatedWeight} kg</p>
                                <p className="listing-detail">💰 ₹{pickup.price}</p>
                                <p className="listing-detail">📅 {new Date(pickup.date).toLocaleDateString()}</p>
                                <span className="badge badge-completed">Completed</span>

                                <button
                                    onClick={() => openReviewModal(pickup)}
                                    className="btn-primary"
                                    style={{ marginTop: '15px', width: '100%' }}
                                >
                                    <Star size={16} style={{ display: 'inline', marginRight: '5px' }} />
                                    Rate Transporter
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
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
                        maxWidth: '500px',
                        width: '90%'
                    }}>
                        <h2 style={{ color: 'white', marginTop: 0 }}>Rate Transporter</h2>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ color: 'white', display: 'block', marginBottom: '10px' }}>Rating</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={32}
                                        fill={star <= rating ? '#ffd700' : 'none'}
                                        stroke={star <= rating ? '#ffd700' : 'white'}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ color: 'white', display: 'block', marginBottom: '10px' }}>Comment</label>
                            <textarea
                                className="form-textarea"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="4"
                                placeholder="Share your experience..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={submitReview} className="btn-primary">Submit Review</button>
                            <button onClick={() => setShowReviewModal(false)} className="btn-primary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;

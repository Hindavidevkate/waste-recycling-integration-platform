import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import API, { BASE_URL } from '../../services/api';
import './TransporterLayout.css';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showProofModal, setShowProofModal] = useState(false);
    const [proofData, setProofData] = useState({
        notes: '',
        weight: ''
    });

    const fetchJobs = React.useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/transporters/jobs/my-jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const updateStatus = async (jobId, status) => {
        try {
            const token = localStorage.getItem('token');
            await API.put(`/transporters/jobs/${jobId}/status`,
                { deliveryStatus: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Status updated successfully!');
            fetchJobs();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const submitProof = async () => {
        try {
            const token = localStorage.getItem('token');
            await API.post('/transporters/delivery-proof', {
                pickupId: selectedJob._id,
                ...proofData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Delivery proof submitted!');
            setShowProofModal(false);
            fetchJobs();
        } catch (err) {
            alert('Failed to submit proof');
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>My Jobs</h1>

            {jobs.length === 0 ? (
                <div className="form-section">
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>No active jobs.</p>
                </div>
            ) : (
                <div className="jobs-grid">
                    {jobs.map(job => (
                        <div key={job._id} className="job-card">
                            {job.images && job.images.length > 0 && (
                                <img
                                    src={`${BASE_URL}${job.images[0]}`}
                                    alt="Waste"
                                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                                />
                            )}
                            <h3>{job.wasteType}</h3>
                            <p className="job-detail">📍 {job.address}</p>
                            <p className="job-detail">⚖️ {job.estimatedWeight} kg</p>
                            <p className="job-detail">💰 ₹{job.price}</p>
                            <span className={`badge badge-${job.deliveryStatus || 'pending'}`}>
                                {job.deliveryStatus || 'Pending'}
                            </span>

                            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {job.deliveryStatus === 'pending' && (
                                    <button className="btn-primary" onClick={() => updateStatus(job._id, 'picked-up')}>
                                        Mark as Picked Up
                                    </button>
                                )}
                                {job.deliveryStatus === 'picked-up' && (
                                    <button className="btn-primary" onClick={() => updateStatus(job._id, 'in-transit')}>
                                        Mark In Transit
                                    </button>
                                )}
                                {job.deliveryStatus === 'in-transit' && (
                                    <button className="btn-primary" onClick={() => {
                                        setSelectedJob(job);
                                        setShowProofModal(true);
                                    }}>
                                        <Upload size={16} style={{ display: 'inline', marginRight: '5px' }} />
                                        Submit Proof
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Proof Modal */}
            {showProofModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="form-section" style={{ maxWidth: '500px', width: '90%' }}>
                        <h2>Submit Delivery Proof</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Actual Weight (kg)"
                                value={proofData.weight}
                                onChange={(e) => setProofData({ ...proofData, weight: e.target.value })}
                            />
                            <textarea
                                className="form-textarea"
                                placeholder="Notes (optional)"
                                value={proofData.notes}
                                onChange={(e) => setProofData({ ...proofData, notes: e.target.value })}
                                rows="4"
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn-primary" onClick={submitProof}>Submit</button>
                                <button className="btn-secondary" onClick={() => setShowProofModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyJobs;

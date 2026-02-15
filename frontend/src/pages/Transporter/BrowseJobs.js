import React, { useState, useEffect } from 'react';
import { Filter, MapPin } from 'lucide-react';
import API, { BASE_URL } from '../../services/api';
import './TransporterLayout.css';

const BrowseJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        wasteType: '',
        minPrice: '',
        maxPrice: '',
        minWeight: '',
        maxWeight: ''
    });

    const fetchJobs = React.useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const res = await API.get(`/transporters/jobs/available?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [filters]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleAcceptJob = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            await API.post(`/transporters/jobs/${jobId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Job accepted successfully!');
            fetchJobs();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to accept job');
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>Browse Jobs</h1>

            <div className="filter-panel">
                <div className="filter-group">
                    <label>Waste Type</label>
                    <select name="wasteType" className="filter-input" value={filters.wasteType} onChange={handleFilterChange}>
                        <option value="">All Types</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Metal">Metal</option>
                        <option value="Paper">Paper</option>
                        <option value="Glass">Glass</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Organic">Organic</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Min Price (₹)</label>
                    <input type="number" name="minPrice" className="filter-input" value={filters.minPrice} onChange={handleFilterChange} placeholder="0" />
                </div>
                <div className="filter-group">
                    <label>Max Price (₹)</label>
                    <input type="number" name="maxPrice" className="filter-input" value={filters.maxPrice} onChange={handleFilterChange} placeholder="10000" />
                </div>
                <div className="filter-group">
                    <label>Min Weight (kg)</label>
                    <input type="number" name="minWeight" className="filter-input" value={filters.minWeight} onChange={handleFilterChange} placeholder="0" />
                </div>
                <button className="btn-primary" onClick={fetchJobs}>
                    <Filter size={16} style={{ display: 'inline', marginRight: '5px' }} />
                    Apply Filters
                </button>
            </div>

            {jobs.length === 0 ? (
                <div className="form-section">
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>No jobs available matching your criteria.</p>
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
                            <p className="job-detail"><MapPin size={14} style={{ display: 'inline', marginRight: '5px' }} />{job.address}</p>
                            <p className="job-detail">⚖️ Weight: {job.estimatedWeight} kg</p>
                            <p className="job-detail">💰 Payment: ₹{job.price}</p>
                            <p className="job-detail">📅 Date: {new Date(job.date).toLocaleDateString()}</p>
                            {job.description && <p className="job-detail" style={{ fontSize: '12px', fontStyle: 'italic' }}>{job.description}</p>}
                            <button className="btn-primary" style={{ width: '100%', marginTop: '15px' }} onClick={() => handleAcceptJob(job._id)}>
                                Accept Job
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseJobs;

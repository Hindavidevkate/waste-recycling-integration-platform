import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Eye, Check, X } from 'lucide-react';

const PickupsPage = () => {
    const [pickups, setPickups] = useState([]);

    useEffect(() => {
        fetchPickups();
    }, []);

    const fetchPickups = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/pickups/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPickups(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            // We'll need an endpoint to update status. Assuming PUT /pickups/:id/status exists or we add it.
            // For now, assuming /pickups/:id with body { status }
            const token = localStorage.getItem('token');
            // Actually the backend/models/Pickup.js doesn't have a specific update route revealed in snippet,
            // but typically it's needed. I'll rely on the existing /pickups/:id or /admin/pickups/:id if I created one.
            // Wait, I haven't verified if there is a route to update pickup status for admin.
            // I should probably add one in admin.js or check temp.js
            console.log("Update status", id, status);
            // Implement after checking backend capabilities
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Pickup Requests</h2>
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Waste Type</th>
                            <th>User</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pickups.map(p => (
                            <tr key={p._id}>
                                <td>{p._id.substring(0, 6)}...</td>
                                <td>{p.wasteType}</td>
                                <td>{p.userId?.name || 'Unknown'}</td>
                                <td>
                                    <span className={`status-badge ${p.status === 'pending' ? 'status-pending' : p.status === 'completed' ? 'status-resolved' : ''}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td>{new Date(p.date).toLocaleDateString()}</td>
                                <td>
                                    <button className="action-btn" title="View Details"><Eye size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PickupsPage;

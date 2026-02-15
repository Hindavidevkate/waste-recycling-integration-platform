import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { CheckCircle, XCircle } from 'lucide-react';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/complaints', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const resolveComplaint = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await API.put(`/complaints/${id}/resolve`, { status, adminResponse: 'Resolved by Admin' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComplaints();
        } catch (err) {
            alert("Failed to update complaint");
        }
    };

    return (
        <div>
            <h2>User Complaints</h2>
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Subject</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map(c => (
                            <tr key={c._id}>
                                <td>{c.userId?.name || 'Unknown'}</td>
                                <td>{c.subject}</td>
                                <td>{c.description}</td>
                                <td>
                                    <span className={`status-badge status-${c.status === 'resolved' ? 'active' : c.status === 'dismissed' ? 'inactive' : 'pending'}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td>
                                    {c.status === 'pending' && (
                                        <>
                                            <button className="action-btn" onClick={() => resolveComplaint(c._id, 'resolved')} title="Resolve"><CheckCircle size={18} color="green" /></button>
                                            <button className="action-btn" onClick={() => resolveComplaint(c._id, 'dismissed')} title="Dismiss"><XCircle size={18} color="red" /></button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Complaints;

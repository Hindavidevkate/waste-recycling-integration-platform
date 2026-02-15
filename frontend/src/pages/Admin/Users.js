import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { User, Trash2, Edit } from 'lucide-react';

const UsersPage = ({ roleFilter }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = roleFilter ? `/admin/users?role=${roleFilter}` : '/admin/users';
            const res = await API.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem('token');
            await API.delete(`/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>{roleFilter ? `${roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}s` : 'All Users'} Management</h2>
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="user-avatar" style={{ width: '30px', height: '30px', fontSize: '12px' }}>
                                            <User size={16} />
                                        </div>
                                        {user.name}
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className="status-badge status-active">{user.role}</span>
                                </td>
                                <td>{user.phone || 'N/A'}</td>
                                <td>
                                    <button className="action-btn"><Edit size={16} /></button>
                                    <button className="action-btn delete-btn" onClick={() => deleteUser(user._id)}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;

import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

const WasteCategories = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', pricePerKg: '', unit: 'kg' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await API.get('/waste-categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingId) {
                await API.put(`/waste-categories/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await API.post('/waste-categories', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setFormData({ name: '', description: '', pricePerKg: '', unit: 'kg' });
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            alert("Failed to save category");
        }
    };

    const handleEdit = (cat) => {
        setFormData({ name: cat.name, description: cat.description, pricePerKg: cat.pricePerKg, unit: cat.unit });
        setEditingId(cat._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            const token = localStorage.getItem('token');
            await API.delete(`/waste-categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    return (
        <div>
            <h2>Manage Waste Categories</h2>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                <h3>{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                    <input className="form-input" placeholder="Category Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input className="form-input" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <input className="form-input" type="number" placeholder="Price per Unit" value={formData.pricePerKg} onChange={e => setFormData({ ...formData, pricePerKg: e.target.value })} />
                    <select className="form-input" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}>
                        <option value="kg">kg</option>
                        <option value="item">item</option>
                    </select>
                    <button type="submit" className="btn-primary" style={{ height: '40px', padding: '0 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', description: '', pricePerKg: '', unit: 'kg' }); }} style={{ height: '40px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>}
                </form>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat._id}>
                                <td>{cat.name}</td>
                                <td>{cat.description}</td>
                                <td>{cat.pricePerKg} / {cat.unit}</td>
                                <td>
                                    <button className="action-btn" onClick={() => handleEdit(cat)}><Edit size={16} /></button>
                                    <button className="action-btn delete-btn" onClick={() => handleDelete(cat._id)}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WasteCategories;

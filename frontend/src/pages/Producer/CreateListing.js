import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import '../Producer/ProducerLayout.css';

const CreateListing = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        wasteType: '',
        date: '',
        description: '',
        estimatedWeight: '',
        price: ''
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert("You can upload maximum 5 images");
            return;
        }
        setSelectedImages(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreview.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setImagePreview(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            selectedImages.forEach(image => {
                submitData.append('images', image);
            });

            await API.post('/pickups', submitData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Listing created successfully!");
            navigate('/producer/listings');
        } catch (err) {
            alert("Failed to create listing");
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>Create New Listing</h1>

            <div className="form-section">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <input
                            className="form-input"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="form-input"
                            name="address"
                            placeholder="Pickup Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                        <select
                            className="form-select"
                            name="wasteType"
                            value={formData.wasteType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Waste Type</option>
                            <option value="Plastic">Plastic</option>
                            <option value="Metal">Metal</option>
                            <option value="Paper">Paper</option>
                            <option value="Glass">Glass</option>
                            <option value="Electronic">Electronic</option>
                            <option value="Organic">Organic</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                        <input
                            className="form-input"
                            type="number"
                            name="estimatedWeight"
                            placeholder="Estimated Weight (kg)"
                            value={formData.estimatedWeight}
                            onChange={handleChange}
                        />
                        <input
                            className="form-input"
                            type="number"
                            name="price"
                            placeholder="Expected Price (₹)"
                            value={formData.price}
                            onChange={handleChange}
                        />
                        <input
                            className="form-input"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <textarea
                        className="form-textarea"
                        name="description"
                        placeholder="Description (optional)"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        style={{ marginTop: '15px', width: '100%' }}
                    />

                    <div style={{ marginTop: '20px' }}>
                        <label style={{ color: 'white', display: 'block', marginBottom: '10px', fontWeight: '600' }}>
                            <Upload size={18} style={{ display: 'inline', marginRight: '8px' }} />
                            Upload Photos (Max 5)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className="btn-primary" style={{ display: 'inline-block', cursor: 'pointer' }}>
                            Choose Files
                        </label>
                    </div>

                    {imagePreview.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                            {imagePreview.map((preview, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            background: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '25px',
                                            height: '25px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" style={{ marginTop: '25px' }}>
                        Create Listing
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateListing;

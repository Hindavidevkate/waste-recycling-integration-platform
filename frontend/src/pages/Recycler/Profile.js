import React from 'react';
import './RecyclerLayout.css';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="profile">
            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        fontWeight: 'bold'
                    }}>
                        {user?.name?.charAt(0)}
                    </div>
                    <h3>{user?.name}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>{user?.facilityType || 'Recycling Center'}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Contact Information</h4>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
                        <p><strong>Address:</strong> {user?.address || 'Not provided'}</p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Accepted Materials</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {user?.acceptedWasteTypes?.map((type, i) => (
                                <span key={i} style={{ padding: '0.2rem 0.6rem', background: 'var(--glass-border)', borderRadius: '4px', fontSize: '0.8rem' }}>
                                    {type}
                                </span>
                            )) || 'No materials listed'}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Certifications</h4>
                    {user?.recyclingCertificates?.length > 0 ? (
                        user.recyclingCertificates.map((cert, i) => (
                            <div key={i} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', marginTop: '0.5rem' }}>
                                <p><strong>{cert.name}</strong></p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No certifications uploaded.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

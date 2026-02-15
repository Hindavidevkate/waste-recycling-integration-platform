import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecyclerLayout.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recyclers/stats/${user.id}`);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user.id]);

  if (loading) return <div>Loading Dashboard...</div>;

  return (
    <div className="dashboard-content">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-muted)' }}>Total Shipments</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats?.shipments || 0}</p>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-muted)' }}>Pending Deliveries</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats?.pendingShipments || 0}</p>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-muted)' }}>Material Procured (kg)</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats?.totalMaterials || 0}</p>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3>Material Composition</h3>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {stats?.materialGroups?.map(group => (
            <div key={group._id} style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '4px solid var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                marginBottom: '0.5rem'
              }}>
                {group.total}
              </div>
              <span>{group._id}</span>
            </div>
          ))}
          {(!stats?.materialGroups || stats.materialGroups.length === 0) && (
            <p style={{ color: 'var(--text-muted)' }}>No inventory data available yet.</p>
          )}
        </div>
      </div>

      <div className="glass-card">
        <h3>Recent Procurement Activity</h3>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>View detailed logs in the history tab.</p>
        {/* Placeholder for small table or list */}
      </div>
    </div>
  );
};

export default Dashboard;

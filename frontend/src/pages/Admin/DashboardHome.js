import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Users, Truck, Factory, Trash2, Clock, CheckCircle } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPickups: 0,
        pendingPickups: 0,
        totalRecycledWeight: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/reports/dashboard-stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const chartData = {
        labels: ['Pending', 'Completed', 'Cancelled'],
        datasets: [
            {
                label: '# of Pickups',
                data: [stats.pendingPickups, stats.totalPickups - stats.pendingPickups, 0], // Simplified
                backgroundColor: [
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Dashboard Overview</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <StatCard title="Total Users" value={stats.totalUsers} icon={<Users />} color="#e3f2fd" textColor="#0d47a1" />
                <StatCard title="Total Pickups" value={stats.totalPickups} icon={<Trash2 />} color="#e8f5e9" textColor="#1b5e20" />
                <StatCard title="Pending Requests" value={stats.pendingPickups} icon={<Clock />} color="#fff3cd" textColor="#856404" />
                <StatCard title="Recycled (kg)" value={stats.totalRecycledWeight} icon={<CheckCircle />} color="#f3e5f5" textColor="#4a148c" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3>Pickup Status</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut data={chartData} />
                    </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3>Latest Activity</h3>
                    <p>Activity timeline coming soon...</p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, textColor }) => (
    <div className="stat-card">
        <div className="stat-icon" style={{ background: color, color: textColor }}>
            {icon}
        </div>
        <div className="stat-info">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    </div>
);

export default DashboardHome;

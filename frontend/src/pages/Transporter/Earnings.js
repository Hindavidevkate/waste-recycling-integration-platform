import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Clock } from 'lucide-react';
import API from '../../services/api';
import './TransporterLayout.css';

const Earnings = () => {
    const [stats, setStats] = useState({
        totalEarnings: 0,
        monthlyEarnings: 0,
        completedJobs: 0
    });
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            const token = localStorage.getItem('token');
            const statsRes = await API.get('/transporters/earnings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsRes.data);

            const paymentsRes = await API.get('/transporters/payments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(paymentsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>Earnings & Payments</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3><DollarSign size={18} style={{ display: 'inline', marginRight: '8px' }} />Total Life Earnings</h3>
                    <p className="value">₹{stats.totalEarnings}</p>
                </div>
                <div className="stat-card">
                    <h3><Clock size={18} style={{ display: 'inline', marginRight: '8px' }} />Earnings (This Month)</h3>
                    <p className="value">₹{stats.monthlyEarnings}</p>
                </div>
                <div className="stat-card">
                    <h3><CreditCard size={18} style={{ display: 'inline', marginRight: '8px' }} />Completed Payouts</h3>
                    <p className="value">{payments.length}</p>
                </div>
            </div>

            <div className="form-section">
                <h2>Payment History</h2>
                {payments.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>No payment records found.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Client</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(p => (
                                <tr key={p._id}>
                                    <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                                    <td>{p.userId?.name || 'Producer'}</td>
                                    <td>₹{p.price}</td>
                                    <td><span className="badge badge-completed">Paid</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Earnings;

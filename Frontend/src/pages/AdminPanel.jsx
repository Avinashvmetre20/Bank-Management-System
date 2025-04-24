import { useEffect, useState } from 'react';
import API from '../services/api';

function AdminPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      {stats ? (
        <ul>
          <li>Total Users: {stats.users}</li>
          <li>Total Accounts: {stats.accounts}</li>
          <li>Total Loans: {stats.loans}</li>
          <li>Total Cards: {stats.cards}</li>
          <li>Total Bank Balance: ₹{stats.bankBalance}</li>
          <li>Total Deposits: ₹{stats.totalDeposits}</li>
        </ul>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
}

export default AdminPanel;

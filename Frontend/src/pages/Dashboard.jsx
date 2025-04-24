import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/profile');
        setUser(res.data);
      } catch (err) {
        console.error('Profile error', err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="container">
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>

          {/* Navigation Links */}
          <div className="links">
            <h3>Navigate to:</h3>
            <ul>
              <li><Link to="/accounts">Accounts</Link></li>
              <li><Link to="/cards">Cards</Link></li>
              <li><Link to="/loans">Loans</Link></li>
              <li><Link to="/transactions">Transactions</Link></li>
              {user.role === 'admin' && (
                <li><Link to="/admin-panel">Admin Panel</Link></li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Dashboard;

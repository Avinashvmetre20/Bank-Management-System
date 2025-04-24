import { useState, useEffect } from 'react';
import API from '../services/api';

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [accountType, setAccountType] = useState('savings');

  // Fetch all user accounts
  const fetchAccounts = async () => {
    try {
      const res = await API.get('/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  // Create a new account
  const createAccount = async () => {
    try {
      await API.post('/accounts', { accountType });
      alert('Account created successfully');
      fetchAccounts(); // Refresh accounts
    } catch (err) {
      alert(err.response?.data?.message || 'Account creation failed');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="container">
      <h2>Your Bank Accounts</h2>

      {/* Account Creation */}
      <div style={{ marginBottom: '1rem' }}>
        <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          <option value="savings">Savings</option>
          <option value="current">Current</option>
        </select>
        <button onClick={createAccount} style={{ marginLeft: '0.5rem' }}>
          Create Account
        </button>
      </div>

      {/* List of Accounts */}
      {accounts.length === 0 ? (
        <p>No accounts found</p>
      ) : (
        <ul>
          {accounts.map((acc) => (
            <li key={acc._id}>
              <strong>Account No:</strong> {acc.accountNumber} | <strong>Type:</strong> {acc.accountType} | <strong>Balance:</strong> ₹{acc.balance} | <strong>Status:</strong>{' '}
              {acc.isActive ? 'Active' : 'Inactive'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Accounts;

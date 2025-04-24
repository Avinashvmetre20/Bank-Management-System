import { useState, useEffect } from 'react';
import API from '../services/api';

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [type, setType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await API.get('/accounts/my'); // Adjust this endpoint based on your actual route
      setAccounts(res.data);
      if (res.data.length > 0) {
        setAccountId(res.data[0]._id);
        setToAccountId(res.data[0]._id);
      }
    } catch (err) {
      alert('Failed to fetch accounts');
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload;

      if (type === 'deposit' || type === 'withdraw') {
        if (!accountId) return alert('Please select an account.');
        payload = { accountId, amount: parseFloat(amount) };
      } else if (type === 'transfer') {
        if (!accountId || !toAccountId) return alert('Please select both accounts.');
        payload = {
          fromId: accountId,
          toId: toAccountId,
          amount: parseFloat(amount),
        };
      }

      const res = await API.post(`/transactions/${type}`, payload);
      alert(`${type} successful`);
      setAmount('');
      fetchTransactions();
    } catch (err) {
      alert('Transaction failed');
      console.error(err);
    }
  };

  const downloadPDF = async () => {
    try {
      const res = await API.get('/transactions/download/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Transaction_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  return (
    <div className="container">
      <h2>Transactions</h2>

      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setType(e.target.value)} value={type}>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="transfer">Transfer</option>
        </select>

        {/* Account selectors */}
        {(type === 'deposit' || type === 'withdraw') && (
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
            <option value="">Select Account</option>
            {accounts.map(acc => (
              <option key={acc._id} value={acc._id}>
                {acc.accountNumber} - ₹{acc.balance}
              </option>
            ))}
          </select>
        )}

        {type === 'transfer' && (
          <>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
              <option value="">From Account</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountNumber} - ₹{acc.balance}
                </option>
              ))}
            </select>

            <select value={toAccountId} onChange={(e) => setToAccountId(e.target.value)} required>
              <option value="">To Account</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountNumber} - ₹{acc.balance}
                </option>
              ))}
            </select>
          </>
        )}

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>

      <button onClick={downloadPDF} style={{ marginTop: '1rem' }}>
        Download PDF Report
      </button>

      <h3 style={{ marginTop: '2rem' }}>Your Transaction History</h3>
      <ul>
        {transactions.map((txn, index) => (
          <li key={txn._id}>
            {index + 1}. [{txn.type.toUpperCase()}] ₹{txn.amount} - {txn.status ?? 'Pending'} on{' '}
            {new Date(txn.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;

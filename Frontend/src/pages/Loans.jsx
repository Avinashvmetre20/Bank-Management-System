import { useState, useEffect } from 'react';
import API from '../services/api';

function Loans() {
  const [amount, setAmount] = useState('');
  const [loans, setLoans] = useState([]);

  const applyLoan = async (e) => {
    e.preventDefault();
    try {
      await API.post('/loans/apply', { amount: parseFloat(amount) });
      alert('Loan applied');
      setAmount('');
      fetchLoans();
    } catch {
      alert('Loan request failed');
    }
  };

  const fetchLoans = async () => {
    const res = await API.get('/loans/my');
    setLoans(res.data);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="container">
      <h2>Loans</h2>
      <form onSubmit={applyLoan}>
        <input type="number" placeholder="Loan Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button type="submit">Apply</button>
      </form>
      <h3>Your Loans</h3>
      <ul>
        {loans.map((loan) => (
          <li key={loan._id}>Amount: ₹{loan.amount} | Status: {loan.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default Loans;

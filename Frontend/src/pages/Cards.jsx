import { useState, useEffect } from 'react';
import API from '../services/api';

function Cards() {
  const [cards, setCards] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [cardType, setCardType] = useState('debit'); // Default card type
  const [isAdmin, setIsAdmin] = useState(false); // Check if the user is an admin

  // Function to request a new card
  const requestCard = async () => {
    try {
      const cardData = { accountId, cardType }; // Prepare data for card request
      await API.post('/cards/request', cardData); // Call the backend to request card
      alert('Card requested');
      fetchCards(); // Fetch the updated list of cards
    } catch (err) {
      alert('Card request failed');
    }
  };

  // Fetch user cards
  const fetchCards = async () => {
    try {
      const res = await API.get('/cards');
      setCards(res.data);
    } catch (err) {
      console.error('Error fetching cards:', err);
    }
  };

  // Admin functionality to update card status (approve/reject)
  const updateCardStatus = async (cardId, status) => {
    try {
      await API.put('/cards/status', { cardId, status }); // Send update to the backend
      alert('Card status updated');
      fetchCards(); // Refresh the card list
    } catch (err) {
      alert('Failed to update card status');
    }
  };

  // Check if user is admin (for showing admin options)
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const res = await API.get('/auth/profile');
        if (res.data.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    checkUserRole();
    fetchCards(); // Initial card fetch
  }, []);

  return (
    <div className="container">
      <h2>Your Cards</h2>
      
      {/* Request New Card Form */}
      <div>
        <input
          type="text"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
        <button onClick={requestCard}>Request New Card</button>
      </div>

      {/* Display Cards */}
      <ul>
        {cards.map((card) => (
          <li key={card._id}>
            <p>Card No: ****{card.cardNumber.slice(-4)} | Status: {card.status}</p>
            
            {/* Admin options to approve/reject card */}
            {isAdmin && card.status === 'pending' && (
              <div>
                <button onClick={() => updateCardStatus(card._id, 'approved')}>Approve</button>
                <button onClick={() => updateCardStatus(card._id, 'rejected')}>Reject</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cards;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Not authorized');
      window.location.href = '/login';
      return;
    }
  
    // Submit card request
    document.getElementById('cardForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const accountId = document.getElementById('accountId').value;
      const cardType = document.getElementById('cardType').value;
  
      try {
        const response = await fetch('http://localhost:8080/api/cards/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accountId, cardType }),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert('Card requested successfully!');
          document.getElementById('cardForm').reset();
          loadUserCards(); // Refresh card list
        } else {
          alert(data.message || 'Request failed');
        }
      } catch (error) {
        alert('Error requesting card: ' + error);
      }
    });
  
    // Load user's cards
    async function loadUserCards() {
      try {
        const response = await fetch('http://localhost:8080/api/cards', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const cards = await response.json();
        const cardList = document.getElementById('cardList');
        cardList.innerHTML = '';
  
        if (response.ok && cards.length) {
          cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.innerHTML = `
              <p><strong>Type:</strong> ${card.cardType}</p>
              <p><strong>Number:</strong> ${card.cardNumber}</p>
              <p><strong>Expiry:</strong> ${card.expiry}</p>
              <p><strong>Status:</strong> ${card.status}</p>
              <hr>
            `;
            cardList.appendChild(cardEl);
          });
        } else {
          cardList.textContent = 'No cards found.';
        }
      } catch (error) {
        console.error('Error loading cards:', error);
        document.getElementById('cardList').textContent = 'Failed to load cards.';
      }
    }
  
    // Initial load
    loadUserCards();
  });
  
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Not authorized');
        window.location.href = '/login';
        return;
    }

    // Fetch dashboard stats
    fetch('http://localhost:8080/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('totalUsers').textContent = data.totalUsers;
        document.getElementById('totalAccounts').textContent = data.totalAccounts;
        document.getElementById('totalLoans').textContent = data.totalLoans;
        document.getElementById('totalCards').textContent = data.totalCards;
        document.getElementById('bankBalance').textContent = data.bankBalance;
        document.getElementById('totalDeposits').textContent = data.totalDeposits;
    })
    .catch(err => console.error('Error loading dashboard:', err));

    fetchCardsToApprove(token);
    fetchLoansToApprove(token);
});

function fetchCardsToApprove(token) {
    fetch('http://localhost:8080/api/cards', {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => res.json())
    .then(cards => {
        const cardList = document.getElementById('cardList');
        cardList.innerHTML = '';
        cards
            .filter(card => card.status === 'pending')
            .forEach(card => {
                const cardEl = document.createElement('div');
                cardEl.innerHTML = `
                    <p>Card Number: ${card.cardNumber} | Type: ${card.cardType} | Status: ${card.status}</p>
                    <button onclick="updateCardStatus('${card._id}', 'approved')">Approve</button>
                    <button onclick="updateCardStatus('${card._id}', 'rejected')">Reject</button>
                `;
                cardList.appendChild(cardEl);
            });
    });
}

function updateCardStatus(cardId, status) {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/cards/status', {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, status }),
    })
    .then(res => res.json())
    .then(data => {
        alert(`Card ${status}`);
        fetchCardsToApprove(token);
    })
    .catch(err => alert('Error updating card status: ' + err.message));
}

function fetchLoansToApprove(token) {
    fetch('http://localhost:8080/api/loans', {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => res.json())
    .then(loans => {
        const loanList = document.getElementById('loanList');
        loanList.innerHTML = '';
        loans
            .filter(loan => loan.status === 'pending')
            .forEach(loan => {
                const loanEl = document.createElement('div');
                loanEl.innerHTML = `
                    <p>Loan ID: ${loan._id} | Amount: ₹${loan.amount} | Status: ${loan.status}</p>
                    <button onclick="updateLoanStatus('${loan._id}', 'approved')">Approve</button>
                    <button onclick="updateLoanStatus('${loan._id}', 'rejected')">Reject</button>
                `;
                loanList.appendChild(loanEl);
            });
    });
}

function updateLoanStatus(loanId, status) {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/loans/status', {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loanId, status }),
    })
    .then(res => res.json())
    .then(data => {
        alert(`Loan ${status}`);
        fetchLoansToApprove(token);
    })
    .catch(err => alert('Error updating loan status: ' + err.message));
}

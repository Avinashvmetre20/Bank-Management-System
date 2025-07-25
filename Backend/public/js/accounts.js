const token = localStorage.getItem('token');
const listDiv = document.getElementById('accountsList');
const createAccountForm = document.getElementById('createAccountForm');
const accountTypeSelect = document.getElementById('accountType');
const messageDiv = document.getElementById('accountsMessage');

function showMessage(msg, color = '#e53935') {
  if (messageDiv) {
    messageDiv.textContent = msg;
    messageDiv.style.color = color;
  }
}
function clearMessage() {
  if (messageDiv) messageDiv.textContent = '';
}

if (!token) {
  showMessage('Please login first.');
  setTimeout(() => { window.location.href = 'index.html'; }, 1200);
}

// Fetch and display accounts
function renderAccountsTable(accounts) {
  return `
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Account Number</th>
            <th>Type</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Transactions</th>
          </tr>
        </thead>
        <tbody>
          ${accounts.map(acc => `
            <tr>
              <td>${acc._id}</td>
              <td>${acc.accountNumber}</td>
              <td>${acc.accountType}</td>
              <td>₹${acc.balance.toFixed(2)}</td>
              <td>${acc.isActive ? 'Active' : 'Inactive'}</td>
              <td><a href="transactions.html?id=${acc._id}">View</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function fetchAccounts() {
  clearMessage();
  fetch('http://localhost:8080/api/accounts', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(accounts => {
      if (!Array.isArray(accounts)) throw new Error('Invalid response');
      if (accounts.length === 0) {
        listDiv.innerHTML = '<p>No accounts found. Please create one.</p>';
        return;
      }
      listDiv.innerHTML = renderAccountsTable(accounts);
    })
    .catch(err => {
      console.error(err);
      showMessage('Error fetching accounts.');
      listDiv.innerHTML = '';
    });
}

fetchAccounts();

// Handle account creation
createAccountForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessage();
  const accountType = accountTypeSelect.value;
  if (!accountType) {
    showMessage('Please select an account type.');
    return;
  }
  try {
    const response = await fetch('http://localhost:8080/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ accountType }),
    });
    const data = await response.json();
    if (response.ok) {
      showMessage('Account created successfully!', '#388e3c');
      createAccountForm.reset();
      fetchAccounts();
    } else {
      showMessage(data.message || 'Failed to create account.');
    }
  } catch (error) {
    showMessage('Error creating account: ' + error);
  }
});

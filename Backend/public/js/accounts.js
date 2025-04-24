const token = localStorage.getItem('token');
const listDiv = document.getElementById('accountsList');
const createAccountForm = document.getElementById('createAccountForm');
const accountTypeSelect = document.getElementById('accountType');

if (!token) {
  alert('Please login first');
  window.location.href = 'index.html';
}

// Fetch and display accounts
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

    listDiv.innerHTML = `
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
              <td>$${acc.balance.toFixed(2)}</td>
              <td>${acc.isActive ? 'Active' : 'Inactive'}</td>
              <td><a href="transactions.html?id=${acc._id}">View</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  })
  .catch(err => {
    console.error(err);
    listDiv.innerHTML = '<p>Error fetching accounts.</p>';
  });

// Handle account creation
createAccountForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const accountType = accountTypeSelect.value;
  if (!accountType) {
    alert('Please select an account type');
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
      alert('Account created successfully!');
      createAccountForm.reset();
      // Reload the accounts list
      fetchAccounts();
    } else {
      alert(data.message || 'Failed to create account');
    }
  } catch (error) {
    alert('Error creating account: ' + error);
  }
});

// Fetch accounts again after account creation
function fetchAccounts() {
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

      listDiv.innerHTML = `
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
                <td>$${acc.balance.toFixed(2)}</td>
                <td>${acc.isActive ? 'Active' : 'Inactive'}</td>
                <td><a href="transactions.html?id=${acc._id}">View</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    })
    .catch(err => {
      console.error(err);
      listDiv.innerHTML = '<p>Error fetching accounts.</p>';
    });
}

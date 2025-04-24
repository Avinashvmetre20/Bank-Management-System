const token = localStorage.getItem('token');
const listDiv = document.getElementById('transactionList');

if (!token) {
  alert('Please login first');
  window.location.href = 'index.html';
}

fetch('http://localhost:8080/api/transactions', {
  headers: { Authorization: `Bearer ${token}` },
})
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data)) throw new Error('Invalid response');

    if (data.length === 0) {
      listDiv.innerHTML = '<p>No transactions found.</p>';
      return;
    }

    listDiv.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(txn => `
            <tr>
              <td>${txn.type}</td>
              <td>₹${txn.amount}</td>
              <td>${txn.status}</td>
              <td>${txn.fromAccount || '-'}</td>
              <td>${txn.toAccount || '-'}</td>
              <td>${new Date(txn.createdAt).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  })
  .catch(err => {
    console.error(err);
    listDiv.innerHTML = '<p>Error loading transactions</p>';
  });

// Transaction Form Logic
function openForm(type) {
  document.getElementById('formContainer').classList.add('visible');
  document.getElementById('actionType').value = type;
  document.getElementById('formTitle').innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} Money`;
  document.getElementById('toAccountField').classList.toggle('hidden', type !== 'transfer');
}

function closeForm() {
  document.getElementById('formContainer').classList.remove('visible');
}

document.getElementById('txnForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const type = document.getElementById('actionType').value;
  const accountId = document.getElementById('accountId').value;
  const amount = document.getElementById('amount').value;
  const toId = document.getElementById('toId').value;

  let url = 'http://localhost:8080/api/transactions/' + type;
  let body = { accountId, amount: parseFloat(amount) };

  if (type === 'transfer') {
    url = 'http://localhost:8080/api/transactions/transfer';
    body = { fromId: accountId, toId, amount: parseFloat(amount) };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const result = await res.json();

  if (res.ok) {
    alert('Transaction successful!');
    location.reload();
  } else {
    alert(result.message || 'Transaction failed');
  }
});

function downloadPDF() {
    const token = localStorage.getItem('token');
  
    fetch('http://localhost:8080/api/transactions/download/pdf', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message || 'Download failed'); });
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Transaction_Report.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading PDF:', error);
        alert('Failed to download transaction report: ' + error.message);
      });
  }

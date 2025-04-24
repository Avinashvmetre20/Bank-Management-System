document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Not authorized');
      window.location.href = '/login';
      return;
    }
  
    // Submit loan application
    document.getElementById('loanForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const amount = parseFloat(document.getElementById('amount').value);
      const termMonths = parseInt(document.getElementById('termMonths').value);
  
      try {
        const response = await fetch('http://localhost:8080/api/loans/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, termMonths }),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert('Loan application submitted!');
          document.getElementById('loanForm').reset();
          loadUserLoans(); // Refresh loan list
        } else {
          alert(data.message || 'Failed to apply for loan');
        }
      } catch (error) {
        alert('Error applying for loan: ' + error);
      }
    });
  
    // Load user's loans
    async function loadUserLoans() {
      try {
        const response = await fetch('http://localhost:8080/api/loans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const loans = await response.json();
        const loanList = document.getElementById('loanList');
        loanList.innerHTML = '';
  
        if (response.ok && loans.length) {
          loans.forEach(loan => {
            const loanEl = document.createElement('div');
            loanEl.innerHTML = `
              <p><strong>Amount:</strong> ₹${loan.amount}</p>
              <p><strong>Term:</strong> ${loan.termMonths} months</p>
              <p><strong>Monthly EMI:</strong> ₹${loan.monthlyEMI}</p>
              <p><strong>Status:</strong> ${loan.status}</p>
              <hr>
            `;
            loanList.appendChild(loanEl);
          });
        } else {
          loanList.textContent = 'No loans found.';
        }
      } catch (error) {
        console.error('Error loading loans:', error);
        document.getElementById('loanList').textContent = 'Failed to load loans.';
      }
    }
  
    // Initial load
    loadUserLoans();
  });
  
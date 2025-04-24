const profileDiv = document.getElementById('profileData');
const token = localStorage.getItem('token');
const logoutBtn = document.getElementById('logoutBtn');

// If no token, redirect to login page
if (!token) {
  alert('Please login first');
  window.location.href = 'index.html';
}

// Show logout button if user is logged in
if (token) {
  logoutBtn.style.display = 'inline-block';
}

// Logout functionality
logoutBtn.onclick = () => {
  localStorage.removeItem('token');
  alert('Logged out');
  window.location.href = 'index.html';
}

// Fetch user profile data
fetch('http://localhost:8080/api/auth/profile', {
  headers: { Authorization: `Bearer ${token}` },
})
  .then(res => res.json())
  .then(data => {
    // Populate profile data
    profileDiv.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Role:</strong> ${data.role}</p>
    `;
    
    // Show Admin Panel link only for admins
    if (data.role === 'admin') {
      document.getElementById('adminLink').style.display = 'block';
    }
  })
  .catch(err => {
    console.error(err);
    alert('Unauthorized or session expired');
    window.location.href = 'index.html';
  });

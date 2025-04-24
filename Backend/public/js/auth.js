const BASE_URL = 'http://localhost:8080/api/auth';

// Toggle between Login and Register forms
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

document.getElementById('toRegister').onclick = () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
};

document.getElementById('toLogin').onclick = () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
};

// Show the logout button if the user is logged in
const logoutBtn = document.getElementById('logoutBtn');
const token = localStorage.getItem('token');

if (token) {
  logoutBtn.style.display = 'inline-block';
} else {
  logoutBtn.style.display = 'none';
}

logoutBtn.onclick = () => {
  localStorage.removeItem('token');
  alert('Logged out');
  window.location.href = 'index.html';
};

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = 'profile.html';
  } else {
    alert(data.message);
  }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = 'profile.html';
  } else {
    alert(data.message);
  }
});

const BASE_URL = 'http://localhost:8080/api/auth';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formMessage = document.getElementById('formMessage');
const loginBtn = loginForm.querySelector('button[type="submit"]');
const registerBtn = registerForm.querySelector('button[type="submit"]');

// Helper: Validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
// Helper: Validate password (min 6 chars)
function isValidPassword(password) {
  return password.length >= 4;
}
// Helper: Show message
function showMessage(msg, color = '#e53935') {
  formMessage.textContent = msg;
  formMessage.style.color = color;
}
function clearMessage() {
  formMessage.textContent = '';
}

// Tab and toggle logic for login/register
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

function showLogin() {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.style.display = '';
  registerForm.style.display = 'none';
  clearMessage();
}
function showRegister() {
  loginTab.classList.remove('active');
  registerTab.classList.add('active');
  loginForm.style.display = 'none';
  registerForm.style.display = '';
  clearMessage();
}
if (loginTab && registerTab && toRegister && toLogin) {
  loginTab.onclick = showLogin;
  registerTab.onclick = showRegister;
  toRegister.onclick = showRegister;
  toLogin.onclick = showLogin;
}

// Tab switch clears messages
[document.getElementById('loginTab'), document.getElementById('registerTab')].forEach(tab => {
  if (tab) tab.addEventListener('click', clearMessage);
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessage();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  // Client-side validation
  if (!isValidEmail(email)) {
    showMessage('Please enter a valid email address.');
    return;
  }
  if (!isValidPassword(password)) {
    showMessage('Password must be at least 6 characters.');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';
  try {
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
      showMessage(data.message || 'Login failed.');
    }
  } catch (err) {
    showMessage('Network error. Please try again.');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessage();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;

  // Client-side validation
  if (!name) {
    showMessage('Name is required.');
    return;
  }
  if (!isValidEmail(email)) {
    showMessage('Please enter a valid email address.');
    return;
  }
  if (!isValidPassword(password)) {
    showMessage('Password must be at least 6 characters.');
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = 'Registering...';
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      showMessage('Registration successful! You can now log in.', '#388e3c');
      setTimeout(() => {
        document.getElementById('loginTab').click();
      }, 1200);
      registerForm.reset();
    } else {
      showMessage(data.message || 'Registration failed.');
    }
  } catch (err) {
    showMessage('Network error. Please try again.');
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = 'Register';
  }
});

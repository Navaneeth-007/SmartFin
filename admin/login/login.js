import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXK-0FKH1hC-LiEASaIWolvxqk-2MnbWI",
    authDomain: "smartfin-40e30.firebaseapp.com",
    projectId: "smartfin-40e30",
    storageBucket: "smartfin-40e30.appspot.com",
    messagingSenderId: "14976464670",
    appId: "1:14976464670:web:98756ac774dc67b3613b0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const adminLoginForm = document.getElementById('adminLoginForm');
const errorMessage = document.getElementById('error-message');

// Admin credentials
const ADMIN_EMAIL = 'Admin@123';
const ADMIN_PASSWORD = 'Admin@123';

// Admin login handler
adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    try {
        // Check for admin credentials
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            window.location.href = '../dashboard/dashboard.html';
        } else {
            showError('Invalid admin credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred. Please try again.');
    }
});

function showError(message) {
    errorMessage.textContent = message;
} 
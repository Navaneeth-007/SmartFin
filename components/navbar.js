// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDqXpYwQZQZQZQZQZQZQZQZQZQZQZQZQZQ",
    authDomain: "smartfin-12345.firebaseapp.com",
    projectId: "smartfin-12345",
    storageBucket: "smartfin-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:1234567890123456789012"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const profileButton = document.querySelector('.profile-button');
const profileDropdown = document.querySelector('.dropdown-menu');
const profileImage = document.querySelector('.profile-image');
const profileName = document.querySelector('.profile-name');
const dropdownProfileImage = document.querySelector('.dropdown-profile-image');
const dropdownUsername = document.querySelector('.dropdown-username');
const dropdownEmail = document.querySelector('.dropdown-email');
const logoutButton = document.getElementById('logout-button');
const themeToggle = document.querySelector('.theme-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const html = document.documentElement;

// Notification Elements
const notificationButton = document.querySelector('.notification-button');
const notificationDropdown = document.querySelector('.notification-dropdown');
const markAllReadButton = document.querySelector('.mark-all-read');
const notificationBadge = document.querySelector('.notification-badge');

// Theme Toggle
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Profile Dropdown Toggle
function toggleProfileDropdown() {
    profileDropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!profileButton.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.classList.remove('show');
    }
});

// Handle logout
async function handleLogout() {
    try {
        await signOut(auth);
        // Clear any stored data
        localStorage.clear();
        // Redirect to sign-in page
        window.location.href = '/login/login.html';
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Failed to logout. Please try again.');
    }
}

// Update active link based on current page
function updateActiveLink() {
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update profile information based on auth state
function updateProfileInfo(user) {
    if (user) {
        const displayName = user.displayName || 'User';
        const email = user.email || 'user@example.com';
        const photoURL = user.photoURL || 'https://via.placeholder.com/32';

        profileName.textContent = displayName;
        profileImage.src = photoURL;
        dropdownUsername.textContent = displayName;
        dropdownEmail.textContent = email;
        dropdownProfileImage.src = photoURL;
    } else {
        profileName.textContent = 'Guest';
        profileImage.src = 'https://via.placeholder.com/32';
        dropdownUsername.textContent = 'Guest';
        dropdownEmail.textContent = 'guest@example.com';
        dropdownProfileImage.src = 'https://via.placeholder.com/48';
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Profile dropdown toggle
    if (profileButton) {
        profileButton.addEventListener('click', toggleProfileDropdown);
    }

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateActiveLink();
});

// Update profile information
onAuthStateChanged(auth, (user) => {
    updateProfileInfo(user);
});

// Notification Dropdown
notificationButton.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('show');
    if (profileDropdown) {
        profileDropdown.classList.remove('show');
    }
});

// Mark all notifications as read
markAllReadButton.addEventListener('click', () => {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    notificationBadge.textContent = '0';
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-container') && !e.target.closest('.notification-container')) {
        profileDropdown.classList.remove('show');
        notificationDropdown.classList.remove('show');
    }
}); 
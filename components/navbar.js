// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
import { initializeThemeManager, setupThemeToggle } from '../shared/theme-manager.js';
import { auth } from '../firebase-config/firebase-config.js';
import { onAuthStateChanged as modularOnAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

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
const profileName = document.getElementById('profile-name');
const notificationButton = document.querySelector('.notification-button');
const notificationDropdown = document.querySelector('.notification-dropdown');
const markAllReadButton = document.querySelector('.mark-all-read');
const notificationBadge = document.querySelector('.notification-badge');
const themeToggle = document.getElementById('theme-toggle');

// Sample notifications data
const sampleNotifications = [
    {
        id: 1,
        title: 'Monthly Budget Update',
        message: 'You have spent 75% of your monthly budget. ₹12,500 remaining.',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: false,
        icon: 'fas fa-chart-pie'
    },
    {
        id: 2,
        title: 'Bill Payment Reminder',
        message: 'Electricity bill of ₹2,500 is due in 3 days.',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        read: false,
        icon: 'fas fa-bolt'
    },
    {
        id: 3,
        title: 'Savings Goal Achieved',
        message: 'Congratulations! You have reached your emergency fund goal of ₹50,000.',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true,
        icon: 'fas fa-piggy-bank'
    },
    {
        id: 4,
        title: 'Investment Opportunity',
        message: 'Your monthly SIP of ₹5,000 has been processed successfully.',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        read: true,
        icon: 'fas fa-chart-line'
    },
    {
        id: 5,
        title: 'Spending Alert',
        message: 'Your dining out expenses are 30% higher than last month.',
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        read: true,
        icon: 'fas fa-utensils'
    }
];

function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (currentPath.includes(link.getAttribute('data-page'))) {
            link.classList.add('active');
        }
    });
}

// Update profile display (only navbar image/initials)
function updateProfileDisplay(user) {
    if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        const initial = displayName.charAt(0).toUpperCase();
        profileName.textContent = displayName;
    }
}

// Format notification time
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
}

// Render notifications
function renderNotifications() {
    const notificationList = document.querySelector('.notification-list');
    if (!notificationList) return;

    notificationList.innerHTML = sampleNotifications.map(notification => `
        <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
            <div class="notification-icon">
                <i class="${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${formatTime(notification.timestamp)}</span>
            </div>
        </div>
    `).join('');

    const unreadCount = sampleNotifications.filter(n => !n.read).length;
    if (notificationBadge) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeThemeManager();
    setupThemeToggle();
    updateActiveNavLink();
  
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = '/login/login.html';
            } catch (error) {
                console.error('Error signing out:', error);
            }
        });
    }

    document.querySelectorAll('.notification-dropdown').forEach(drop => drop.classList.remove('show'));

    // Toggle notifications
    if (notificationButton && notificationDropdown) {
        notificationButton.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
        });
    }
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-container')) {
            if (notificationDropdown) {
                notificationDropdown.classList.remove('show');
            }
        }
    });


    // Notification interaction
    renderNotifications();
  
    document.addEventListener('click', (e) => {
        const notificationItem = e.target.closest('.notification-item');
        if (notificationItem) {
            const id = parseInt(notificationItem.dataset.id);
            const notification = sampleNotifications.find(n => n.id === id);
            if (notification && !notification.read) {
                notification.read = true;
                renderNotifications();
            }
        }
    });


    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            sampleNotifications.forEach(notification => {
                notification.read = true;
            });
            renderNotifications();
        });
    }

    const profileNavBtn = document.getElementById('profile-nav-btn');
    const profileName = document.querySelector('.profile-name');

    modularOnAuthStateChanged(auth, (user) => {
        if (user) {
            let displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
            profileName.textContent = displayName;
        } else {
            profileName.textContent = 'Guest';
        }
    });

    if (profileNavBtn) {
        profileNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/profile/profile.html';
        });
    }
});

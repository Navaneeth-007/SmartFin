// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
import { initializeThemeManager, setupThemeToggle } from '../shared/theme-manager.js';

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

// Function to update active nav link
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

// Function to update profile display
function updateProfileDisplay(user) {
    const profileImage = document.querySelector('.profile-image');
    const profileInitial = document.querySelector('.profile-initial');
    const dropdownProfileImage = document.querySelector('.dropdown-profile-image');
    const dropdownProfileInitial = document.querySelector('.dropdown-profile-initial');
    const profileName = document.querySelector('.profile-name');
    const dropdownUsername = document.querySelector('.dropdown-username');
    const dropdownEmail = document.querySelector('.dropdown-email');
    
    if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        const initial = displayName.charAt(0).toUpperCase();
        
        // Update profile name and email
        profileName.textContent = displayName;
        dropdownUsername.textContent = displayName;
        dropdownEmail.textContent = user.email;
        
        if (user.photoURL) {
            // Show profile image if available
            profileImage.src = user.photoURL;
            dropdownProfileImage.src = user.photoURL;
            profileImage.style.display = 'block';
            dropdownProfileImage.style.display = 'block';
            profileInitial.style.display = 'none';
            dropdownProfileInitial.style.display = 'none';
        } else {
            // Show initial if no profile image
            profileInitial.textContent = initial;
            dropdownProfileInitial.textContent = initial;
            profileInitial.style.display = 'block';
            dropdownProfileInitial.style.display = 'block';
            profileImage.style.display = 'none';
            dropdownProfileImage.style.display = 'none';
        }
    } else {
        // Default state when no user is logged in
        profileName.textContent = 'Guest';
        dropdownUsername.textContent = 'Guest';
        dropdownEmail.textContent = 'guest@example.com';
        profileInitial.textContent = 'G';
        dropdownProfileInitial.textContent = 'G';
        profileInitial.style.display = 'block';
        dropdownProfileInitial.style.display = 'block';
        profileImage.style.display = 'none';
        dropdownProfileImage.style.display = 'none';
    }
}

// Function to render notifications
function renderNotifications() {
    const notificationList = document.querySelector('.notification-list');
    if (!notificationList) return;

    // Clear empty state if it exists
    const emptyState = notificationList.querySelector('.empty-notifications');
    if (emptyState) {
        emptyState.remove();
    }

    // Render notifications
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

    // Update badge count
    const unreadCount = sampleNotifications.filter(n => !n.read).length;
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Function to format time
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing navbar...');
    
    // Initialize theme manager
    initializeThemeManager();
    setupThemeToggle();
    
    // Update active nav link
    updateActiveNavLink();
    
    // Handle logout
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
    
    // --- IMPROVEMENT 1: Close all dropdowns on page load ---
    document.querySelectorAll('.dropdown-menu, .notification-dropdown').forEach(drop => drop.classList.remove('show'));
    
    // Profile dropdown toggle
    if (profileButton && profileDropdown) {
        // Remove previous event listeners if any
        profileButton.replaceWith(profileButton.cloneNode(true));
        const newProfileButton = document.querySelector('.profile-button');
        newProfileButton.addEventListener('click', () => {
            profileDropdown.classList.toggle('show');
        });

        // --- IMPROVEMENT 2: Close dropdown on any dropdown-item click (with delay) ---
        const dropdownItems = profileDropdown.querySelectorAll('.dropdown-item[href]');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                profileDropdown.classList.remove('show');
                // Add a small delay before navigation for visual feedback
                const href = item.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    setTimeout(() => { window.location.href = href; }, 120);
                }
            });
        });
    }
    
    // --- IMPROVEMENT 4: Robust close on outside click ---
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-container')) {
            if (notificationDropdown) {
                notificationDropdown.classList.remove('show');
            }
        }
        if (!e.target.closest('.profile-container')) {
            if (profileDropdown) {
                profileDropdown.classList.remove('show');
            }
        }
    });
    
    // Notification functionality
    if (notificationButton && notificationDropdown) {
        notificationButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // Toggle the dropdown
            notificationDropdown.classList.toggle('show');
            // Close profile dropdown if open
            if (profileDropdown) {
                profileDropdown.classList.remove('show');
            }
        });
    }
    
    // Initialize notifications
    renderNotifications();
    
    // Handle notification item clicks
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
    
    // Handle mark all as read
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            sampleNotifications.forEach(notification => {
                notification.read = true;
            });
            renderNotifications();
        });
    }
});

// Listen for auth state changes
onAuthStateChanged(auth, user => {
    console.log('Auth state changed:', user);
    updateProfileDisplay(user);
}); 
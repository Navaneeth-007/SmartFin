// DOM Elements
let notificationButton, notificationDropdown, profileButton, dropdownMenu, themeToggle, markAllReadButton, logoutButton, body;

// Initialize DOM elements after navbar is loaded
function initializeElements() {
    notificationButton = document.querySelector('.notification-button');
    notificationDropdown = document.querySelector('.notification-dropdown');
    profileButton = document.querySelector('.profile-button');
    dropdownMenu = document.querySelector('.dropdown-menu');
    themeToggle = document.querySelector('.theme-toggle');
    markAllReadButton = document.querySelector('.mark-all-read');
    logoutButton = document.querySelector('.dropdown-item:last-child');
    body = document.documentElement;

    // Add event listeners
    if (notificationButton) notificationButton.addEventListener('click', toggleNotificationDropdown);
    if (profileButton) profileButton.addEventListener('click', toggleProfileDropdown);
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (markAllReadButton) markAllReadButton.addEventListener('click', markAllNotificationsAsRead);
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);

    // Initialize theme
    initializeTheme();
    
    // Set active link
    setActiveLink();
    
    // Update user profile
    updateUserProfile();
}

// Get the current page path
const currentPath = window.location.pathname;

// Set active link based on current page
function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update user profile
function updateUserProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const profileImage = document.querySelector('.profile-image');
        const profileName = document.querySelector('.profile-name');
        
        if (profileImage) {
            profileImage.src = user.photoURL || '/assets/images/default-avatar.png';
        }
        if (profileName) {
            profileName.textContent = user.displayName || 'User';
        }
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-container') && !e.target.closest('.notification-container')) {
        document.querySelectorAll('.dropdown-menu, .notification-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

// Functions
function toggleNotificationDropdown() {
    if (notificationDropdown && dropdownMenu) {
        notificationDropdown.classList.toggle('show');
        dropdownMenu.classList.remove('show');
    }
}

function toggleProfileDropdown() {
    if (dropdownMenu && notificationDropdown) {
        dropdownMenu.classList.toggle('show');
        notificationDropdown.classList.remove('show');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function markAllNotificationsAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    const badge = document.querySelector('.notification-badge');
    if (unreadItems && badge) {
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
        badge.textContent = '0';
    }
}

function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = '/login/login.html';
}

// Initialize theme
function initializeTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeElements);

// Also initialize when the script is loaded dynamically
initializeElements();

// Listen for theme changes from other components
document.addEventListener('themeChanged', (event) => {
    const newTheme = event.detail.theme;
    body.setAttribute('data-theme', newTheme);
}); 
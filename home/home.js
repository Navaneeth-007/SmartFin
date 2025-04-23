// Sample data for charts
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// Format numbers in Indian numbering system (with commas)
function formatIndianRupees(number) {
    // Convert to string and remove any existing commas
    let str = number.toString().replace(/,/g, '');
    
    // Split the string into parts before and after decimal point
    let parts = str.split('.');
    let mainPart = parts[0];
    let decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    
    // Format the main part with commas for lakhs and crores
    let lastThree = mainPart.length > 3 ? mainPart.substring(mainPart.length - 3) : mainPart;
    let otherNumbers = mainPart.length > 3 ? mainPart.substring(0, mainPart.length - 3) : '';
    
    if (otherNumbers !== '') {
        let formattedOtherNumbers = '';
        for (let i = otherNumbers.length - 1; i >= 0; i--) {
            formattedOtherNumbers = otherNumbers[i] + formattedOtherNumbers;
            if ((otherNumbers.length - i) % 2 === 0 && i !== 0) {
                formattedOtherNumbers = ',' + formattedOtherNumbers;
            }
        }
        return formattedOtherNumbers + ',' + lastThree + decimalPart;
    }
    
    return lastThree + decimalPart;
}

// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const logoutButton = document.getElementById('logout-button');
const profileButton = document.querySelector('.profile-button');
const dropdownMenu = document.querySelector('.dropdown-menu');
const notificationButton = document.querySelector('.notification-button');
const notificationDropdown = document.querySelector('.notification-dropdown');
const markAllReadButton = document.querySelector('.mark-all-read');
const notificationBadge = document.querySelector('.notification-badge');

// Theme Switching
themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update chart colors
    updateChartColors();
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Notification Handling
notificationButton.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('show');
});

// Close notification dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!notificationButton.contains(e.target)) {
        notificationDropdown.classList.remove('show');
    }
});

// Mark all notifications as read
markAllReadButton.addEventListener('click', () => {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
    });
    notificationBadge.style.display = 'none';
});

// Profile Dropdown
profileButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!profileButton.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// Logout functionality
logoutButton.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        await firebase.auth().signOut();
        window.location.href = '../login/login.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Update profile information when auth state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const profileName = document.querySelector('.profile-name');
        const profileImage = document.querySelector('.profile-image');
        
        // Update profile name
        profileName.textContent = user.displayName || 'User';
        
        // Update profile image
        if (user.photoURL) {
            profileImage.src = user.photoURL;
        } else {
            // Generate avatar with user's name
            const name = user.displayName || 'User';
            profileImage.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
        }
        
        // Update welcome message
        const welcomeName = document.querySelector('.welcome-section .highlight');
        if (welcomeName) {
            welcomeName.textContent = user.displayName || 'User';
        }
    } else {
        // Redirect to login if not authenticated
        window.location.href = '../login/login.html';
    }
});

// Chart.js Configuration
const chartConfig = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
};

// Spending Chart
const spendingCtx = document.getElementById('spendingChart').getContext('2d');
const spendingChart = new Chart(spendingCtx, {
    ...chartConfig,
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Spending',
            data: [65000, 59000, 80000, 81000, 56000, 75000],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true
        }]
    }
});

// Savings Chart
const savingsCtx = document.getElementById('savingsChart').getContext('2d');
const savingsChart = new Chart(savingsCtx, {
    ...chartConfig,
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Savings',
            data: [25000, 30000, 35000, 40000, 45000, 50000],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true
        }]
    }
});

// Update chart colors based on theme
function updateChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    [spendingChart, savingsChart].forEach(chart => {
        chart.options.scales.y.grid.color = gridColor;
        chart.update();
    });
}

// Listen for theme changes
themeToggle.addEventListener('click', updateChartColors);

// Initial chart color update
updateChartColors();

// Add event listeners for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Update user name and current month
function updateUserInfo() {
    const userNameElement = document.getElementById('user-name');
    const currentMonthElement = document.getElementById('current-month');
    
    // Get current month and year
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();
    
    if (currentMonthElement) {
        currentMonthElement.textContent = `${currentMonth} ${currentYear}`;
    }
    
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            const displayName = user.displayName || user.email.split('@')[0];
            if (userNameElement) {
                userNameElement.textContent = displayName;
            }
        } else {
            // User is signed out
            if (userNameElement) {
                userNameElement.textContent = 'User';
            }
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateUserInfo();
});
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
        console.log('Auth state changed:', user); // Debug log
        
        if (user) {
            // User is signed in
            let displayName = 'User';
            
            if (user.displayName) {
                displayName = user.displayName;
            } else if (user.email) {
                // Use email username if no display name
                displayName = user.email.split('@')[0];
            }
            
            console.log('Setting user name to:', displayName); // Debug log
            
            if (userNameElement) {
                userNameElement.textContent = displayName;
            } else {
                console.error('User name element not found'); // Debug log
            }
        } else {
            // User is signed out
            console.log('No user signed in'); // Debug log
            if (userNameElement) {
                userNameElement.textContent = 'User';
            }
            // Redirect to login if not authenticated
            window.location.href = '/login/login.html';
        }
    });
}

// Function to initialize charts
function initializeCharts() {
    console.log('Initializing charts...'); // Debug log
    console.log('Chart object available:', typeof Chart !== 'undefined'); // Debug log
    
    // Overview Chart (Line Chart)
    const overviewCanvas = document.getElementById('overviewChart');
    console.log('Overview canvas found:', !!overviewCanvas); // Debug log
    
    if (overviewCanvas) {
        try {
            const overviewChart = new Chart(overviewCanvas, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Income',
                        data: [25000, 28000, 30000, 32000, 32500, 35000],
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        fill: false
                    }, {
                        label: 'Expenses',
                        data: [12000, 14000, 13000, 15000, 15200, 16000],
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Income vs Expenses Trend'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
            console.log('Overview chart created successfully'); // Debug log
        } catch (error) {
            console.error('Error creating overview chart:', error); // Debug log
        }
    } else {
        console.error('Overview chart canvas not found'); // Debug log
    }

    // Monthly Breakdown Chart (Doughnut Chart)
    const breakdownCanvas = document.getElementById('monthlyBreakdownChart');
    console.log('Breakdown canvas found:', !!breakdownCanvas); // Debug log
    
    if (breakdownCanvas) {
        try {
            const breakdownChart = new Chart(breakdownCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Others'],
                    datasets: [{
                        data: [5000, 3000, 2000, 1500, 2000, 1700],
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(153, 102, 255)',
                            'rgb(255, 159, 64)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: 'Expense Categories'
                        }
                    }
                }
            });
            console.log('Breakdown chart created successfully'); // Debug log
        } catch (error) {
            console.error('Error creating breakdown chart:', error); // Debug log
        }
    } else {
        console.error('Monthly breakdown chart canvas not found'); // Debug log
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...'); // Debug log
    updateUserInfo();
    
    // Initialize charts after a short delay to ensure DOM is fully loaded
    setTimeout(initializeCharts, 100);
});
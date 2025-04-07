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

// Theme Switcher
const themeToggle = document.getElementById('checkbox');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeToggle.checked = savedTheme === 'dark';

// Theme switch handler
themeToggle.addEventListener('change', () => {
    const theme = themeToggle.checked ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
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
    const isDark = html.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    [spendingChart, savingsChart].forEach(chart => {
        chart.options.scales.y.grid.color = gridColor;
        chart.update();
    });
}

// Listen for theme changes
themeToggle.addEventListener('change', updateChartColors);

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
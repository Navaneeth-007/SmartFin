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

// Spending Chart
const spendingCtx = document.getElementById('spendingChart').getContext('2d');
const spendingChart = new Chart(spendingCtx, {
    type: 'doughnut',
    data: {
        labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
        datasets: [{
            data: [32, 25, 15, 12, 10, 6],
            backgroundColor: [
                '#1e88e5',
                '#26a69a',
                '#ffa726',
                '#7e57c2',
                '#66bb6a',
                '#bdbdbd'
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return `${context.label}: ${value}%`;
                    }
                }
            }
        }
    }
});

// Savings Chart
const savingsCtx = document.getElementById('savingsChart').getContext('2d');
const savingsChart = new Chart(savingsCtx, {
    type: 'line',
    data: {
        labels: months,
        datasets: [{
            label: 'Actual Savings',
            data: [37750, 49075, 45300, 54360, 60400, 54360],
            borderColor: '#26a69a',
            backgroundColor: 'rgba(38, 166, 154, 0.1)',
            fill: true
        }, {
            label: 'Predicted Savings',
            data: [null, null, null, null, null, 54360, 56625, 60400],
            borderColor: '#26a69a',
            backgroundColor: 'rgba(38, 166, 154, 0.1)',
            borderDash: [5, 5],
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.parsed.y !== null) {
                            return `${context.dataset.label}: ₹${formatIndianRupees(context.parsed.y)}`;
                        }
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount (₹)'
                },
                ticks: {
                    callback: function(value) {
                        return '₹' + formatIndianRupees(value);
                    }
                }
            }
        }
    }
});

// Add event listeners for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});
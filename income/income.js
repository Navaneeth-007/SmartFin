// DOM Elements
const incomeForm = document.getElementById('income-form');
const incomeTableBody = document.getElementById('income-table-body');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
let addIncomeModal = null;

// Sample income data
const sampleIncomes = [
    {
        date: '2025-05-15',
        source: 'Monthly Salary',
        category: 'Salary',
        amount: 30000
    },
    {
        date: '2025-05-10',
        source: 'Freelance Project',
        category: 'Freelance',
        amount: 8000
    },
    {
        date: '2025-05-05',
        source: 'Stock Dividends',
        category: 'Investment',
        amount: 2500
    },
    {
        date: '2025-04-25',
        source: 'Monthly Salary',
        category: 'Salary',
        amount: 30000
    },
    {
        date: '2025-04-20',
        source: 'Part-time Job',
        category: 'Other',
        amount: 5000
    },
    {
        date: '2025-04-15',
        source: 'Freelance Project',
        category: 'Freelance',
        amount: 6000
    },
    {
        date: '2025-04-10',
        source: 'Interest Income',
        category: 'Investment',
        amount: 1500
    },
    {
        date: '2025-04-05',
        source: 'Consulting Work',
        category: 'Freelance',
        amount: 4000
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize date selectors
    initializeDateSelectors();

    // Display sample incomes
    displaySampleIncomes();

    // Initialize modal
    addIncomeModal = new bootstrap.Modal(document.getElementById('addIncomeModal'));

    // Handle form submission
    if (incomeForm) {
        incomeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleIncomeSubmit();
        });
    }

    // Handle month/year selection changes
    if (monthSelect) {
        monthSelect.addEventListener('change', displaySampleIncomes);
    }
    if (yearSelect) {
        yearSelect.addEventListener('change', displaySampleIncomes);
    }
});

// Initialize date selectors
function initializeDateSelectors() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Set current month
    if (monthSelect) {
        monthSelect.value = currentDate.getMonth();
    }
    
    // Clear existing options
    if (yearSelect) {
        yearSelect.innerHTML = '';
        
        // Populate years (last 5 years)
        for (let year = currentYear; year >= currentYear - 4; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        
        // Set current year
        yearSelect.value = currentYear;
    }
}

// Display sample incomes in the table
function displaySampleIncomes() {
    if (!incomeTableBody) return;

    // Get selected month and year
    const selectedMonth = monthSelect ? parseInt(monthSelect.value) : new Date().getMonth();
    const selectedYear = yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();

    // Clear existing content
    incomeTableBody.innerHTML = '';

    // Filter incomes for selected month and year
    const filteredIncomes = sampleIncomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === selectedMonth && 
               incomeDate.getFullYear() === selectedYear;
    });

    // Add filtered incomes to the table
    filteredIncomes.forEach(income => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(income.date);
        const formattedDate = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${income.source}</td>
            <td>${income.category}</td>
            <td>₹${income.amount.toLocaleString('en-IN')}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteIncome(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        incomeTableBody.appendChild(row);
    });

    // Show message if no incomes found
    if (filteredIncomes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" class="text-center">No income found for selected period</td>
        `;
        incomeTableBody.appendChild(row);
    }
}

// Handle income form submission
function handleIncomeSubmit() {
    const source = document.getElementById('income-source').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    const date = document.getElementById('income-date').value;
    const category = document.getElementById('income-category').value;
    
    // Validate form
    if (!source || !amount || !date || !category) {
        alert('Please fill in all fields');
        return;
    }
    
    // Add new income to sample data
    sampleIncomes.push({
        date,
        source,
        category,
        amount
    });
    
    // Reset form
    document.getElementById('income-form').reset();
    
    // Close modal
    if (addIncomeModal) {
        addIncomeModal.hide();
    }
    
    // Refresh income list
    displaySampleIncomes();
    
    // Show success message
    alert('Income added successfully!');
}

// Delete income function
function deleteIncome(button) {
    const row = button.closest('tr');
    const date = row.cells[0].textContent;
    const source = row.cells[1].textContent;
    const amount = parseFloat(row.cells[3].textContent.replace('₹', '').replace(/,/g, ''));
    
    // Remove from sample data
    const index = sampleIncomes.findIndex(income => 
        income.source === source && 
        income.amount === amount
    );
    
    if (index !== -1) {
        sampleIncomes.splice(index, 1);
    }
    
    // Remove from table
    row.remove();
} 
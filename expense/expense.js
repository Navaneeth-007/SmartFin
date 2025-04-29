// DOM Elements
const manualExpenseModal = document.getElementById('manual-expense-modal');
const billUploadModal = document.getElementById('bill-upload-modal');
const addManualBtn = document.getElementById('add-manual-btn');
const uploadBillBtn = document.getElementById('upload-bill-btn');
const closeModalButtons = document.querySelectorAll('.close-modal');
const uploadArea = document.getElementById('upload-area');
const expenseTableBody = document.getElementById('expense-table-body');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');

// Sample expense data
const sampleExpenses = [
    {
        date: '2025-05-15',
        description: 'Grocery shopping at Big Bazaar',
        category: 'Food & Dining',
        amount: 2500
    },
    {
        date: '2025-05-14',
        description: 'Monthly electricity bill',
        category: 'Bills & Utilities',
        amount: 1800
    },
    {
        date: '2025-05-13',
        description: 'Movie tickets - Avengers',
        category: 'Entertainment',
        amount: 800
    },
    {
        date: '2025-05-12',
        description: 'Fuel for car',
        category: 'Transportation',
        amount: 2000
    },
    {
        date: '2025-05-11',
        description: 'New headphones',
        category: 'Shopping',
        amount: 3500
    },
    {
        date: '2025-04-20',
        description: 'Dinner at restaurant',
        category: 'Food & Dining',
        amount: 1200
    },
    {
        date: '2025-04-15',
        description: 'Internet bill',
        category: 'Bills & Utilities',
        amount: 900
    },
    {
        date: '2025-04-10',
        description: 'Movie tickets - Dune',
        category: 'Entertainment',
        amount: 600
    },
    {
        date: '2025-04-05',
        description: 'Fuel for bike',
        category: 'Transportation',
        amount: 500
    },
    {
        date: '2025-04-01',
        description: 'New shoes',
        category: 'Shopping',
        amount: 2000
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for modal buttons
    if (addManualBtn) {
        addManualBtn.addEventListener('click', () => openModal(manualExpenseModal));
    }
    
    if (uploadBillBtn) {
        uploadBillBtn.addEventListener('click', () => openModal(billUploadModal));
    }
    
    // Add event listeners for close buttons
    if (closeModalButtons) {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                closeModal(manualExpenseModal);
                closeModal(billUploadModal);
            });
        });
    }

    // Handle file upload area
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
            uploadArea.style.background = 'var(--glass-background)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.background = 'transparent';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.background = 'transparent';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                document.getElementById('bill-image').files = e.dataTransfer.files;
            }
        });

        // Handle click on upload area
        uploadArea.addEventListener('click', () => {
            document.getElementById('bill-image').click();
        });
    }

    // Initialize date selectors
    initializeDateSelectors();

    // Display sample expenses
    displaySampleExpenses();
});

// Initialize date selectors
function initializeDateSelectors() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Set current month
    if (monthSelect) {
        monthSelect.value = currentDate.getMonth();
        monthSelect.addEventListener('change', displaySampleExpenses);
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
        yearSelect.addEventListener('change', displaySampleExpenses);
    }
}

// Display sample expenses in the table
function displaySampleExpenses() {
    if (!expenseTableBody) return;

    // Get selected month and year
    const selectedMonth = monthSelect ? parseInt(monthSelect.value) : new Date().getMonth();
    const selectedYear = yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();

    // Clear existing content
    expenseTableBody.innerHTML = '';

    // Filter expenses for selected month and year
    const filteredExpenses = sampleExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === selectedMonth && 
               expenseDate.getFullYear() === selectedYear;
    });

    // Add filtered expenses to the table
    filteredExpenses.forEach(expense => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(expense.date);
        const formattedDate = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>₹${expense.amount.toLocaleString('en-IN')}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        expenseTableBody.appendChild(row);
    });

    // Show message if no expenses found
    if (filteredExpenses.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" class="text-center">No expenses found for selected period</td>
        `;
        expenseTableBody.appendChild(row);
    }
}

// Modal Functions
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === manualExpenseModal) {
        closeModal(manualExpenseModal);
    }
    if (event.target === billUploadModal) {
        closeModal(billUploadModal);
    }
});

// Delete expense function
function deleteExpense(button) {
    const row = button.closest('tr');
    row.remove();
} 
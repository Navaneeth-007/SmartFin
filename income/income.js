// DOM Elements
const manualExpenseModal = document.getElementById('manual-expense-modal');
const addManualBtn = document.getElementById('add-manual-btn');
const closeModalButtons = document.querySelectorAll('.close-modal');
const uploadArea = document.getElementById('upload-area');
const expenseTableBody = document.getElementById('expense-table-body');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const categoryBreakdownModal = document.getElementById('category-breakdown-modal');
const viewCategoryDetailsBtn = document.getElementById('view-category-details');
const expenseForm = document.getElementById('manual-expense-form');

// INCOME TABLE LOGIC
const incomeTableBody = document.getElementById('income-table-body');
const incomeMonthSelect = document.getElementById('income-month-select');
const incomeYearSelect = document.getElementById('income-year-select');

// Replace all sample/demo logic with backend integration
const user_id = 'PLACEHOLDER_USER_ID'; // TODO: Replace with real user id

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for modal buttons
    if (addManualBtn) {
        addManualBtn.addEventListener('click', () => openModal(manualExpenseModal));
    }
    
    // Add event listeners for close buttons
    if (closeModalButtons) {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                closeModal(manualExpenseModal);
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
        });

        // Handle click on upload area
        uploadArea.addEventListener('click', () => {
            // This part is removed as per the instructions
        });
    }

    // Initialize date selectors
    initializeDateSelectors();

    // Fetch and display expenses
    fetchAndDisplayExpenses();

    // Category Breakdown Modal logic
    if (viewCategoryDetailsBtn && categoryBreakdownModal) {
        viewCategoryDetailsBtn.addEventListener('click', () => openModal(categoryBreakdownModal));
    }
    // Add close logic for the new modal
    if (categoryBreakdownModal) {
        const closeBtn = categoryBreakdownModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(categoryBreakdownModal));
        }
    }

    // Initialize date selectors for income
    initializeIncomeDateSelectors();
    fetchAndDisplayIncome();
});

// Initialize date selectors
function initializeDateSelectors() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Set current month
    if (monthSelect) {
        monthSelect.value = currentDate.getMonth();
        monthSelect.addEventListener('change', fetchAndDisplayExpenses);
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
        yearSelect.addEventListener('change', fetchAndDisplayExpenses);
    }
}

// Fetch and display expenses
async function fetchAndDisplayExpenses() {
    if (!expenseTableBody) return;
    expenseTableBody.innerHTML = '';
    const selectedMonth = monthSelect ? parseInt(monthSelect.value) : new Date().getMonth();
    const selectedYear = yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();
    try {
        const res = await fetch(`/api/transactions/${user_id}`);
        const data = await res.json();
        const expenses = data.filter(t => t.type === 'expense');
        const filtered = expenses.filter(exp => {
            const d = new Date(exp.date);
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        });
        if (filtered.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="text-center">No expenses found for selected period</td>`;
            expenseTableBody.appendChild(row);
        } else {
            filtered.forEach(expense => {
                const date = new Date(expense.date);
                const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category}</td>
                    <td>₹${expense.amount.toLocaleString('en-IN')}</td>
                    <td></td>
                `;
                expenseTableBody.appendChild(row);
            });
        }
    } catch (err) {
        expenseTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Error loading expenses</td></tr>`;
    }
}

// Handle form submit
if (expenseForm) {
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = document.getElementById('expense-description').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const date = document.getElementById('expense-date').value;
        const category = document.getElementById('expense-category').value;
        if (!description || !amount || !date || !category) {
            alert('Please fill in all fields');
            return;
        }
        const payload = {
            user_id,
            type: 'expense',
            date,
            description,
            category,
            amount
        };
        await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        expenseForm.reset();
        if (manualExpenseModal) manualExpenseModal.style.display = 'none';
        fetchAndDisplayExpenses();
    });
}

// Month/year change
if (monthSelect) monthSelect.addEventListener('change', fetchAndDisplayExpenses);
if (yearSelect) yearSelect.addEventListener('change', fetchAndDisplayExpenses);

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
    if (event.target === categoryBreakdownModal) {
        closeModal(categoryBreakdownModal);
    }
});

// Delete expense function
function deleteExpense(button) {
    const row = button.closest('tr');
    row.remove();
}

// Initialize date selectors for income
function initializeIncomeDateSelectors() {
    if (!incomeMonthSelect || !incomeYearSelect) return;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Only populate if empty (prevents double init)
    if (incomeYearSelect.options.length === 0) {
        for (let year = currentYear; year >= currentYear - 4; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            incomeYearSelect.appendChild(option);
        }
    }
    incomeYearSelect.value = currentYear;
    incomeMonthSelect.value = currentDate.getMonth();

    // Remove previous listeners by cloning
    const newMonthSelect = incomeMonthSelect.cloneNode(true);
    incomeMonthSelect.parentNode.replaceChild(newMonthSelect, incomeMonthSelect);
    const newYearSelect = incomeYearSelect.cloneNode(true);
    incomeYearSelect.parentNode.replaceChild(newYearSelect, incomeYearSelect);

    // Re-assign variables
    window.incomeMonthSelect = document.getElementById('income-month-select');
    window.incomeYearSelect = document.getElementById('income-year-select');

    // Attach listeners only once
    window.incomeMonthSelect.addEventListener('change', fetchAndDisplayIncome);
    window.incomeYearSelect.addEventListener('change', fetchAndDisplayIncome);
}

// Fetch and display income
async function fetchAndDisplayIncome() {
    if (!incomeTableBody) return;
    incomeTableBody.innerHTML = '';
    const selectedMonth = incomeMonthSelect ? parseInt(incomeMonthSelect.value) : new Date().getMonth();
    const selectedYear = incomeYearSelect ? parseInt(incomeYearSelect.value) : new Date().getFullYear();
    try {
        const res = await fetch(`/api/transactions/${user_id}`);
        const data = await res.json();
        const incomes = data.filter(t => t.type === 'income');
        const filtered = incomes.filter(inc => {
            const d = new Date(inc.date);
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        });
        if (filtered.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" class="text-center">No income found for selected period</td>`;
            incomeTableBody.appendChild(row);
        } else {
            filtered.forEach(income => {
                const date = new Date(income.date);
                const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${income.source}</td>
                    <td>₹${income.amount.toLocaleString('en-IN')}</td>
                    <td><button class='btn btn-danger btn-sm' onclick='deleteIncome(this)'><i class="fas fa-trash"></i></button></td>
                `;
                incomeTableBody.appendChild(row);
            });
        }
    } catch (err) {
        incomeTableBody.innerHTML = `<tr><td colspan="4" class="text-center">Error loading income</td></tr>`;
    }
}

// Delete income function
function deleteIncome(button) {
    const row = button.closest('tr');
    row.remove();
    // TODO: Optionally, send a DELETE request to backend here
} 
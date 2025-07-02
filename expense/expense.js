// DOM Elements
const manualExpenseModal = document.getElementById('manual-expense-modal');
const addExpenseBtn = document.getElementById('add-expense-btn');
const closeModalButtons = document.querySelectorAll('.close-modal');
const uploadArea = document.getElementById('upload-area');
const expenseTableBody = document.getElementById('expense-table-body');
const monthSelect = document.getElementById('month-select');
const categoryBreakdownModal = document.getElementById('category-breakdown-modal');
const viewCategoryDetailsBtn = document.getElementById('view-category-details');
const expenseForm = document.getElementById('manual-expense-form');

// Replace all sample/demo logic with backend integration
const user_id = 'PLACEHOLDER_USER_ID'; // TODO: Replace with real user id

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for Add Expense button
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', () => openModal(manualExpenseModal));
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
});

// Fetch and display expenses
async function fetchAndDisplayExpenses() {
    if (!expenseTableBody) return;
    expenseTableBody.innerHTML = '';
    const selectedMonth = monthSelect ? parseInt(monthSelect.value) : new Date().getMonth();
    try {
        const res = await fetch(`/api/transactions/${user_id}`);
        const data = await res.json();
        const expenses = data.filter(t => t.type === 'expense');
        const filtered = expenses.filter(exp => {
            const d = new Date(exp.date);
            return d.getMonth() === selectedMonth;
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
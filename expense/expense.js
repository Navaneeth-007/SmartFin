import { auth } from '../firebase-config/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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

let currentUid = null;

function getSelectedMonth() {
    return monthSelect ? parseInt(monthSelect.value) : new Date().getMonth();
}

function getSelectedYear() {
    const yearSelect = document.getElementById('year-select');
    return yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load navigation bar
    fetch('/components/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
            // Load navbar.js after the HTML is loaded
            const script = document.createElement('script');
            script.type = 'module';
            script.src = '/components/navbar.js';
            document.body.appendChild(script);
        })
        .catch(error => console.error('Error loading navigation bar:', error));

    // AI Suggestions functionality
    const container = document.querySelector('.ai-suggestions-container');
    if (container) {
        const refreshButton = container.querySelector('.refresh-suggestions');
        const content = container.querySelector('.ai-suggestions-content');

        const generateSuggestions = () => {
            const categories = [
                { icon: 'fa-chart-line-down', color: 'text-red-500', title: 'High Spending Alert' },
                { icon: 'fa-bolt', color: 'text-yellow-500', title: 'Energy Consumption' },
                { icon: 'fa-piggy-bank', color: 'text-emerald-500', title: 'Savings Opportunity' },
                { icon: 'fa-utensils', color: 'text-orange-500', title: 'Food Expenses' },
                { icon: 'fa-car', color: 'text-blue-500', title: 'Transportation' },
                { icon: 'fa-shopping-bag', color: 'text-purple-500', title: 'Shopping Habits' }
            ];

            const messages = [
                'Your expenses in this category have increased by 25% this month.',
                'Consider switching to more economical alternatives to save up to ₹3,000 monthly.',
                'This expense category is taking up 15% of your monthly income.',
                'You could save ₹2,500 by making small changes to your spending habits.',
                'This category shows a consistent upward trend in your expenses.',
                'Your spending here is 20% higher than the average user in your income bracket.'
            ];

            const savings = [
                'Save up to ₹5,000 monthly',
                'Reduce costs by 15%',
                'Cut expenses by ₹3,000',
                'Save ₹2,500 per month',
                'Reduce spending by 20%',
                'Save up to ₹4,000 monthly'
            ];

            content.innerHTML = '';

            for (let i = 0; i < 3; i++) {
                const category = categories[Math.floor(Math.random() * categories.length)];
                const message = messages[Math.floor(Math.random() * messages.length)];
                const saving = savings[Math.floor(Math.random() * savings.length)];

                const suggestion = document.createElement('div');
                suggestion.className = 'suggestion-item';
                suggestion.innerHTML = `
                    <div class="suggestion-icon">
                        <i class="fas ${category.icon} ${category.color}"></i>
                    </div>
                    <div class="suggestion-text">
                        <h4 class="font-medium">${category.title}</h4>
                        <p>${message} ${saving}.</p>
                    </div>
                `;

                content.appendChild(suggestion);
            }
        };

        generateSuggestions();

        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                refreshButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
                setTimeout(() => {
                    generateSuggestions();
                    refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Suggestions';
                }, 1000);
            });
        }
    }

    // Add event listener for Add Expense button
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', () => {
            console.log('Add Expense button clicked');
            openModal(manualExpenseModal);
        });
    }
    
    // Add event listeners for close buttons
    if (closeModalButtons) {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                closeModal(manualExpenseModal);
            });
        });
    }


    // Fetch and display expenses
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUid = user.uid;
            fetchAndDisplayExpenses();
        } else {
            // Optionally redirect to login
            currentUid = null;
        }
    });

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

    // Month/year change
    const yearSelect = document.getElementById('year-select');
    if (monthSelect) monthSelect.addEventListener('change', fetchAndDisplayExpenses);
    if (yearSelect) yearSelect.addEventListener('change', fetchAndDisplayExpenses);

    // Handle form submit
    if (expenseForm) {
        expenseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUid) return;
            const description = document.getElementById('expense-description').value;
            const amount = parseFloat(document.getElementById('expense-amount').value);
            const date = document.getElementById('expense-date').value;
            const category = document.getElementById('expense-category').value;
            if (!description || !amount || !date || !category) {
                alert('Please fill in all fields');
                return;
            }
            const payload = {
                uid: currentUid,
                date,
                description,
                category,
                amount
            };
            await fetch('http://127.0.0.1:5000/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            expenseForm.reset();
            if (manualExpenseModal) manualExpenseModal.style.display = 'none';
            fetchAndDisplayExpenses();
        });
    }

    // Set default month and year to current
    const now = new Date();
    if (monthSelect) monthSelect.value = now.getMonth();
    if (yearSelect) yearSelect.value = now.getFullYear();
});

// Fetch and display expenses
async function fetchAndDisplayExpenses() {
    if (!currentUid) return;
    if (!expenseTableBody) return;
    expenseTableBody.innerHTML = '';
    const month = getSelectedMonth();
    const year = getSelectedYear();
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/expenses/${currentUid}?month=${month}&year=${year}`);
        let data = await res.json();
        // Sort by date descending (most recent first)
        data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (!data || data.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="text-center">No expenses found for selected period</td>`;
            expenseTableBody.appendChild(row);
        } else {
            data.forEach(expense => {
                const date = new Date(expense.date);
                const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category}</td>
                    <td>₹${expense.amount.toLocaleString('en-IN')}</td>
                    <td><button class="btn btn-danger btn-sm delete-expense-btn" data-id="${expense._id}">Delete</button></td>
                `;
                expenseTableBody.appendChild(row);
            });
            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-expense-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this expense?')) {
                        await fetch(`http://127.0.0.1:5000/api/expenses/${id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                        fetchAndDisplayExpenses();
                    }
                });
            });
        }
    } catch (err) {
        expenseTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Error loading expenses</td></tr>`;
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
    if (event.target === categoryBreakdownModal) {
        closeModal(categoryBreakdownModal);
    }
});

// Delete expense function
function deleteExpense(button) {
    const row = button.closest('tr');
    row.remove();
} 
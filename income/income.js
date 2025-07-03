import { auth } from '../firebase-config/firebase-config.js';

let currentUid = null;
const incomeTableBody = document.getElementById('income-table-body');
const incomeMonthSelect = document.getElementById('income-month-select');
const incomeYearSelect = document.getElementById('income-year-select');
const incomeForm = document.getElementById('income-form');
const addIncomeBtn = document.getElementById('add-income-btn');
const incomeModal = document.getElementById('add-income-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');

function getSelectedIncomeMonth() {
    return incomeMonthSelect ? parseInt(incomeMonthSelect.value) : new Date().getMonth();
}
function getSelectedIncomeYear() {
    return incomeYearSelect ? parseInt(incomeYearSelect.value) : new Date().getFullYear();
}

async function fetchAndDisplayIncomes() {
    if (!currentUid) return;
    if (!incomeTableBody) return;
    incomeTableBody.innerHTML = '';
    const month = getSelectedIncomeMonth();
    const year = getSelectedIncomeYear();
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/incomes/${currentUid}?month=${month}&year=${year}`);
        const data = await res.json();
        if (!data || data.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" class="text-center">No income found for selected period</td>`;
            incomeTableBody.appendChild(row);
        } else {
            data.forEach(income => {
                const date = new Date(income.date);
                const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${income.source}</td>
                    <td>₹${income.amount.toLocaleString('en-IN')}</td>
                    <td><button class="btn btn-danger btn-sm delete-income-btn" data-id="${income._id}">Delete</button></td>
                `;
                incomeTableBody.appendChild(row);
            });
        }
    } catch (err) {
        incomeTableBody.innerHTML = `<tr><td colspan="4" class="text-center">Error loading income</td></tr>`;
    }
}

if (incomeForm) {
    incomeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const source = document.getElementById('income-source').value;
        const amount = parseFloat(document.getElementById('income-amount').value);
        const date = document.getElementById('income-date').value;
        if (!source || !amount || !date) {
            alert('Please fill in all fields');
            return;
        }
        const payload = {
            uid: currentUid,
            date,
            amount,
            source
        };
        await fetch('http://127.0.0.1:5000/api/incomes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        incomeForm.reset();
        if (incomeModal) incomeModal.style.display = 'none';
        fetchAndDisplayIncomes();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Set default month and year to current
    const now = new Date();
    if (incomeMonthSelect) incomeMonthSelect.value = now.getMonth();
    if (incomeYearSelect) incomeYearSelect.value = now.getFullYear();
    if (addIncomeBtn && incomeModal) {
        addIncomeBtn.addEventListener('click', () => incomeModal.style.display = 'block');
    }
    if (closeModalButtons && incomeModal) {
        closeModalButtons.forEach(btn => btn.addEventListener('click', () => incomeModal.style.display = 'none'));
    }
    window.addEventListener('click', (event) => {
        if (event.target === incomeModal) incomeModal.style.display = 'none';
    });
});

if (incomeMonthSelect) incomeMonthSelect.addEventListener('change', fetchAndDisplayIncomes);
if (incomeYearSelect) incomeYearSelect.addEventListener('change', fetchAndDisplayIncomes);

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-income-btn')) {
        const id = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this income?')) {
            await fetch(`http://127.0.0.1:5000/api/incomes/${id}`, { method: 'DELETE' });
            fetchAndDisplayIncomes();
        }
    }
});

// Firebase Auth
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUid = user.uid;
        fetchAndDisplayIncomes();
    } else {
        currentUid = null;
    }
}); 
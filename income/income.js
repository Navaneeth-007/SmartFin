// Replace all sample/demo logic with backend integration
const user_id = 'PLACEHOLDER_USER_ID'; // TODO: Replace with real user id
const incomeTableBody = document.getElementById('income-table-body');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const incomeForm = document.getElementById('income-form');
const incomeModal = document.getElementById('add-income-modal');

// Initialize month and year selectors
function initializeDateSelectors() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Set current month
    if (monthSelect) {
        monthSelect.value = currentDate.getMonth();
        monthSelect.addEventListener('change', fetchAndDisplayIncomes);
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
        yearSelect.addEventListener('change', fetchAndDisplayIncomes);
    }
}

// Fetch and display incomes
async function fetchAndDisplayIncomes() {
    if (!incomeTableBody) return;
    incomeTableBody.innerHTML = '';
    const selectedMonth = monthSelect ? parseInt(monthSelect.value) : new Date().getMonth();
    const selectedYear = yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();
    console.log('Selected month:', selectedMonth, 'Selected year:', selectedYear);
    try {
        const res = await fetch(`/api/transactions/${user_id}`);
        const data = await res.json();
        const incomes = data.filter(t => t.type === 'income');
        const filtered = incomes.filter(inc => {
            const d = new Date(inc.date);
            console.log('Income date:', d, 'Month:', d.getMonth(), 'Year:', d.getFullYear());
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        });
        if (filtered.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="text-center">No income found for selected period</td>`;
            incomeTableBody.appendChild(row);
        } else {
            filtered.forEach(income => {
                const date = new Date(income.date);
                const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${income.source}</td>
                    <td>${income.category}</td>
                    <td>₹${income.amount.toLocaleString('en-IN')}</td>
                    <td></td>
                `;
                incomeTableBody.appendChild(row);
            });
        }
    } catch (err) {
        incomeTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Error loading incomes</td></tr>`;
    }
}

// Handle form submit
if (incomeForm) {
    incomeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const source = document.getElementById('income-source').value;
        const amount = parseFloat(document.getElementById('income-amount').value);
        const date = document.getElementById('income-date').value;
        const category = document.getElementById('income-category').value;
        if (!source || !amount || !date || !category) {
            alert('Please fill in all fields');
            return;
        }
        const payload = {
            user_id,
            type: 'income',
            date,
            source,
            category,
            amount
        };
        await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        incomeForm.reset();
        if (incomeModal) incomeModal.style.display = 'none';
        fetchAndDisplayIncomes();
    });
}

// Month/year change
if (monthSelect) monthSelect.addEventListener('change', fetchAndDisplayIncomes);
if (yearSelect) yearSelect.addEventListener('change', fetchAndDisplayIncomes);

document.addEventListener('DOMContentLoaded', () => {
    initializeDateSelectors();
    fetchAndDisplayIncomes();
}); 
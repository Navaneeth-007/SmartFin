// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js';

// Initialize Firebase
const firebaseConfig = {
    // Your Firebase config here
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM Elements
const manualExpenseModal = document.getElementById('manual-expense-modal');
const billUploadModal = document.getElementById('bill-upload-modal');
const manualExpenseForm = document.getElementById('manual-expense-form');
const billUploadForm = document.getElementById('bill-upload-form');
const addManualBtn = document.getElementById('add-manual-btn');
const uploadBillBtn = document.getElementById('upload-bill-btn');
const closeModalButtons = document.querySelectorAll('.close-modal');
const expenseTableBody = document.getElementById('expense-table-body');
const uploadArea = document.getElementById('upload-area');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const expenseList = document.getElementById('expense-list');
const chartContainer = document.getElementById('expense-chart');
const exportBtn = document.getElementById('export-btn');
const tabButtons = document.querySelectorAll('.tab-btn');

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Initialize Chart
let expenseChart;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeDateSelectors();
    loadExpenses();
    initializeChart();
});

addManualBtn.addEventListener('click', () => openModal(manualExpenseModal));
uploadBillBtn.addEventListener('click', () => openModal(billUploadModal));

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        closeModal(manualExpenseModal);
        closeModal(billUploadModal);
    });
});

window.addEventListener('click', (event) => {
    if (event.target === manualExpenseModal) {
        closeModal(manualExpenseModal);
    }
    if (event.target === billUploadModal) {
        closeModal(billUploadModal);
    }
});

themeToggle.addEventListener('click', toggleTheme);

monthSelect.addEventListener('change', loadExpenses);
yearSelect.addEventListener('change', loadExpenses);

manualExpenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const description = document.getElementById('expense-description').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;
    const category = document.getElementById('expense-category').value;
    
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        
        await addDoc(collection(db, 'expenses'), {
            userId: user.uid,
            description,
            amount,
            date,
            category,
            type: 'manual',
            createdAt: new Date()
        });
        
        // Reset form and close modal
        manualExpenseForm.reset();
        closeModal(manualExpenseModal);
        // Refresh expense list
        loadExpenses();
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('Failed to add expense. Please try again.');
    }
});

billUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('bill-image');
    const date = document.getElementById('bill-date').value;
    const category = document.getElementById('bill-category').value;
    
    if (!fileInput.files[0]) {
        alert('Please select a bill image');
        return;
    }
    
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        
        // Upload image to Firebase Storage
        const file = fileInput.files[0];
        const storageRef = ref(storage, `bills/${user.uid}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // Add expense record with bill URL
        await addDoc(collection(db, 'expenses'), {
            userId: user.uid,
            description: `Bill - ${file.name}`,
            amount: 0, // This will be updated after OCR processing
            date,
            category,
            type: 'bill',
            billUrl: downloadURL,
            createdAt: new Date()
        });
        
        // Reset form and close modal
        billUploadForm.reset();
        closeModal(billUploadModal);
        // Refresh expense list
        loadExpenses();
    } catch (error) {
        console.error('Error uploading bill:', error);
        alert('Failed to upload bill. Please try again.');
    }
});

// Tab Switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and content
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
    });
});

// Handle file upload area
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

// Functions
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function initializeDateSelectors() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Set current month
    monthSelect.value = currentDate.getMonth();
    
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

function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

async function loadExpenses() {
    try {
        const user = auth.currentUser;
        if (!user) return;
        
        const selectedMonth = parseInt(monthSelect.value);
        const selectedYear = parseInt(yearSelect.value);
        
        // Create date range for the selected month
        const startDate = new Date(selectedYear, selectedMonth, 1);
        const endDate = new Date(selectedYear, selectedMonth + 1, 0);
        
        const q = query(
            collection(db, 'expenses'),
            where('userId', '==', user.uid),
            where('date', '>=', startDate.toISOString().split('T')[0]),
            where('date', '<=', endDate.toISOString().split('T')[0]),
            orderBy('date', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        expenseTableBody.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const expense = doc.data();
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td>₹${expense.amount.toFixed(2)}</td>
                <td>
                    ${expense.type === 'bill' ? 
                        `<a href="${expense.billUrl}" target="_blank" class="btn btn-sm btn-primary">
                            <i class="fas fa-eye"></i> View Bill
                        </a>` : 
                        ''}
                    <button class="btn btn-sm btn-danger" onclick="deleteExpense('${doc.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            
            expenseTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

function updateExpenseList(expenses) {
    expenseList.innerHTML = '';

    if (expenses.length === 0) {
        expenseList.innerHTML = '<tr><td colspan="5" class="text-center">No expenses found for this period</td></tr>';
        return;
    }

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>
                <button class="action-button" onclick="viewBill('${expense.billUrl}')">
                    <i class="fas fa-file-invoice"></i>
                </button>
            </td>
        `;
        expenseList.appendChild(row);
    });
}

function updateChart(expenses) {
    const categories = {};
    expenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    if (expenseChart) {
        expenseChart.destroy();
    }

    const ctx = chartContainer.getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f1c40f',
                    '#9b59b6',
                    '#1abc9c'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function updateStatistics(expenses) {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageExpense = totalExpenses / expenses.length || 0;
    const highestExpense = Math.max(...expenses.map(e => e.amount), 0);

    document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('average-expense').textContent = `$${averageExpense.toFixed(2)}`;
    document.getElementById('highest-expense').textContent = `$${highestExpense.toFixed(2)}`;
}

function viewBill(billUrl) {
    if (billUrl) {
        window.open(billUrl, '_blank');
    } else {
        showError('No bill available for this expense');
    }
}

function showSuccess(message) {
    // Implement your success notification system
    console.log('Success:', message);
}

function showError(message) {
    // Implement your error notification system
    console.error('Error:', message);
}

async function exportToPDF() {
    try {
        const month = monthSelect.value;
        const year = yearSelect.value;
        const monthName = monthSelect.options[monthSelect.selectedIndex].text;

        // Fetch expenses data
        const response = await fetch(`/api/expenses?month=${month}&year=${year}`);
        const expenses = await response.json();

        // Create PDF content
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Expense Report', 105, 20, { align: 'center' });
        
        // Add period
        doc.setFontSize(12);
        doc.text(`${monthName} ${year}`, 105, 30, { align: 'center' });
        
        // Add statistics
        doc.setFontSize(14);
        doc.text('Summary', 20, 45);
        
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const averageExpense = totalExpenses / expenses.length || 0;
        const highestExpense = Math.max(...expenses.map(e => e.amount), 0);
        
        doc.setFontSize(12);
        doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`, 20, 55);
        doc.text(`Average Expense: ₹${averageExpense.toFixed(2)}`, 20, 65);
        doc.text(`Highest Expense: ₹${highestExpense.toFixed(2)}`, 20, 75);
        
        // Add expense table
        doc.setFontSize(14);
        doc.text('Expense Details', 20, 90);
        
        // Table headers
        doc.setFontSize(12);
        doc.text('Date', 20, 100);
        doc.text('Category', 50, 100);
        doc.text('Description', 90, 100);
        doc.text('Amount', 150, 100);
        
        // Table rows
        let y = 110;
        expenses.forEach(expense => {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }
            doc.text(expense.date, 20, y);
            doc.text(expense.category, 50, y);
            doc.text(expense.description, 90, y);
            doc.text(`₹${expense.amount.toFixed(2)}`, 150, y);
            y += 10;
        });
        
        // Save the PDF
        doc.save(`expense-report-${monthName.toLowerCase()}-${year}.pdf`);
        
        showSuccess('PDF exported successfully!');
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showError('Failed to export PDF. Please try again.');
    }
}

// Delete expense
async function deleteExpense(expenseId) {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
        await deleteDoc(doc(db, 'expenses', expenseId));
        loadExpenses();
    } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Please try again.');
    }
}

// Initialize the page
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadExpenses();
    } else {
        window.location.href = '/login/login.html';
    }
}); 
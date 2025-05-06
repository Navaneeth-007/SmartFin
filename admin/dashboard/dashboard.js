import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXK-0FKH1hC-LiEASaIWolvxqk-2MnbWI",
    authDomain: "smartfin-40e30.firebaseapp.com",
    projectId: "smartfin-40e30",
    storageBucket: "smartfin-40e30.appspot.com",
    messagingSenderId: "14976464670",
    appId: "1:14976464670:web:98756ac774dc67b3613b0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const userList = document.getElementById('userList');
const userSearch = document.getElementById('userSearch');
const logoutBtn = document.getElementById('logoutBtn');
const modal = document.getElementById('userActionModal');
const closeModal = document.querySelector('.close');
const disableUserBtn = document.getElementById('disableUserBtn');
const deleteUserBtn = document.getElementById('deleteUserBtn');
const modalUserEmail = document.getElementById('modalUserEmail');
const modalUserStatus = document.getElementById('modalUserStatus');

// Check admin session
if (!sessionStorage.getItem('isAdmin')) {
    window.location.href = 'admin-login.html';
}

// Set admin name
document.getElementById('adminName').textContent = 'Admin';
loadUsers();

// Load users from Firebase
async function loadUsers() {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        userList.innerHTML = '';
        
        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            const userCard = createUserCard(doc.id, userData);
            userList.appendChild(userCard);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Create user card element
function createUserCard(userId, userData) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    card.innerHTML = `
        <div class="user-info">
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div>
                <h3>${userData.email || 'No email'}</h3>
                <p>Status: ${userData.disabled ? 'Disabled' : 'Active'}</p>
            </div>
        </div>
        <div class="user-actions">
            <button class="action-btn btn-warning" onclick="openUserModal('${userId}', '${userData.email}', ${userData.disabled})">
                <i class="fas fa-ban"></i>
                ${userData.disabled ? 'Enable' : 'Disable'}
            </button>
            <button class="action-btn btn-danger" onclick="openUserModal('${userId}', '${userData.email}', ${userData.disabled})">
                <i class="fas fa-trash"></i>
                Delete
            </button>
        </div>
    `;
    
    return card;
}

// Search functionality
userSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const userCards = document.querySelectorAll('.user-card');
    
    userCards.forEach(card => {
        const email = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = email.includes(searchTerm) ? 'flex' : 'none';
    });
});

// Modal functionality
window.openUserModal = function(userId, email, isDisabled) {
    modalUserEmail.textContent = email;
    modalUserStatus.textContent = isDisabled ? 'Disabled' : 'Active';
    modal.style.display = 'block';
    
    disableUserBtn.onclick = () => toggleUserStatus(userId, !isDisabled);
    deleteUserBtn.onclick = () => deleteUser(userId);
};

closeModal.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
};

// Toggle user status
async function toggleUserStatus(userId, disable) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            disabled: disable
        });
        loadUsers();
        modal.style.display = 'none';
    } catch (error) {
        console.error('Error updating user status:', error);
    }
}

// Delete user
async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await deleteDoc(doc(db, 'users', userId));
            loadUsers();
            modal.style.display = 'none';
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}

// Update logout functionality
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('isAdmin');
    window.location.href = 'admin-login.html';
});

// AI Status Monitoring
function updateAIStatus() {
    // This is a placeholder for actual AI status monitoring
    // In a real application, you would connect to your AI service's API
    const statusIndicator = document.querySelector('.status-indicator');
    const metrics = document.querySelectorAll('.metric-card p');
    
    // Simulate status updates
    setInterval(() => {
        const isOnline = Math.random() > 0.1; // 90% chance of being online
        statusIndicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
        statusIndicator.innerHTML = `<i class="fas fa-circle"></i> ${isOnline ? 'Online' : 'Offline'}`;
        
        // Update metrics
        metrics[0].textContent = `${(Math.random() * 0.5 + 0.5).toFixed(1)}s avg`;
        metrics[1].textContent = `${(Math.random() * 2 + 97).toFixed(1)}%`;
        metrics[2].textContent = `${(Math.random() * 0.2 + 99.7).toFixed(1)}%`;
    }, 5000);
}

// Start AI status monitoring
updateAIStatus(); 
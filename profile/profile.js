import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';

// Firebase config (should match your project)
const firebaseConfig = {
    apiKey: "AIzaSyDqXpYwQZQZQZQZQZQZQZQZQZQZQZQZQZQ",
    authDomain: "smartfin-12345.firebaseapp.com",
    projectId: "smartfin-12345",
    storageBucket: "smartfin-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:1234567890123456789012"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const profileImage = document.getElementById('profile-image');
const profileInitial = document.getElementById('profile-initial');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');

onAuthStateChanged(auth, (user) => {
    if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        const initial = displayName.charAt(0).toUpperCase();
        profileName.textContent = displayName;
        profileEmail.textContent = user.email;
        if (user.photoURL) {
            profileImage.src = user.photoURL;
            profileImage.style.display = 'block';
            profileInitial.style.display = 'none';
        } else {
            profileInitial.textContent = initial;
            profileInitial.style.display = 'block';
            profileImage.style.display = 'none';
        }
    } else {
        // Not signed in, redirect to login
        window.location.href = '/login/login.html';
    }
});

document.getElementById('logout').addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = '/login/login.html';
});

document.getElementById('edit-profile').addEventListener('click', () => {
    alert('Edit Profile functionality coming soon!');
});

document.getElementById('change-password').addEventListener('click', () => {
    alert('Change Password functionality coming soon!');
}); 
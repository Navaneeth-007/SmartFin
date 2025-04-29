// Import theme configuration
import { initializeTheme, setupThemeToggle } from '../shared/theme-config.js';
import { auth, googleProvider } from '../firebase-config/firebase-config.js';
import { signInWithEmailAndPassword, signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

// DOM Elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupThemeToggle();

    // Password Toggle Functionality
    const togglePassword = document.getElementById('toggle-password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle the eye icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
});

// Function to show error message
function showError(elementId, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const inputGroup = document.getElementById(elementId).closest('.input-group');
    // Remove any existing error message
    const existingError = inputGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    inputGroup.classList.add('error');
    inputGroup.appendChild(errorDiv);
}

// Function to clear error message
function clearError(elementId) {
    const inputGroup = document.getElementById(elementId).closest('.input-group');
    const errorDiv = inputGroup.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    inputGroup.classList.remove('error');
}

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    const rememberMe = rememberCheckbox.checked;
    
    // Clear any existing errors
    clearError('email');
    clearError('password');
    
    try {
        // Set persistence based on remember me checkbox
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in successfully:', userCredential.user);
        
        // Save email if remember me is checked
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        // Redirect to home page
        window.location.href = '../home/home.html';
    } catch (error) {
        console.error('Login error:', error);
        switch (error.code) {
            case 'auth/invalid-email':
                showError('email', 'Invalid email address');
                break;
            case 'auth/user-not-found':
                showError('email', 'No account found with this email');
                break;
            case 'auth/wrong-password':
                showError('password', 'Incorrect password');
                break;
            case 'auth/too-many-requests':
                showError('password', 'Too many failed attempts. Please try again later');
                break;
            default:
                showError('email', 'An error occurred. Please try again');
        }
    }
});

// Handle Google Sign In
document.getElementById('google-signin').addEventListener('click', async () => {
    try {
        // Clear any existing errors
        clearError('email');
        clearError('password');
        
        console.log('Attempting Google sign in...');
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Google sign in successful:', result.user);
        
        // Redirect to home page
        window.location.href = '../home/home.html';
    } catch (error) {
        console.error('Google sign in error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
            showError('email', 'Sign in cancelled');
        } else if (error.code === 'auth/popup-blocked') {
            showError('email', 'Pop-up blocked by browser. Please allow pop-ups for this site');
        } else {
            showError('email', 'Could not sign in with Google. Please try again');
        }
    }
});

// Check for remembered email
window.addEventListener('load', () => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberCheckbox.checked = true;
    }
});

// Add animation to the login card
document.addEventListener('DOMContentLoaded', () => {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.opacity = '0';
    loginCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        loginCard.style.transition = 'all 0.5s ease';
        loginCard.style.opacity = '1';
        loginCard.style.transform = 'translateY(0)';
    }, 100);
});

// Form validation
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

// Email validation function
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Password validation function
function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
}

// Real-time validation
emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email is required';
    } else if (!validateEmail(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
    } else {
        emailError.textContent = '';
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.trim() === '') {
        passwordError.textContent = 'Password is required';
    } else if (!validatePassword(passwordInput.value)) {
        passwordError.textContent = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
    } else {
        passwordError.textContent = '';
    }
}); 
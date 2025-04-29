// Import theme configuration
import { initializeTheme } from '../shared/theme-config.js';

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();

    // Password Toggle Functionality
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
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

    // Google Sign In
    const googleSignInButton = document.getElementById('google-signin');
    
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', async () => {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await firebase.auth().signInWithPopup(provider);
                const user = result.user;
                
                // Redirect to home page
                window.location.href = '../home/home.html';
            } catch (error) {
                console.error('Google sign in error:', error);
                const errorMessage = document.getElementById('password-error');
                if (errorMessage) {
                    errorMessage.textContent = getErrorMessage(error.code);
                    errorMessage.style.display = 'block';
                }
            }
        });
    }
});

// Form validation
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
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

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    const rememberMe = document.getElementById('remember').checked;
    
    try {
        // Set persistence based on remember me checkbox
        const persistence = rememberMe ? 
            firebase.auth.Auth.Persistence.LOCAL : 
            firebase.auth.Auth.Persistence.SESSION;
            
        await firebase.auth().setPersistence(persistence);
        
        // Sign in with email and password
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
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
        const errorMessage = document.getElementById('password-error');
        errorMessage.textContent = getErrorMessage(error.code);
        errorMessage.style.display = 'block';
    }
});

// Remember me functionality
const rememberCheckbox = document.getElementById('remember');

// Check if there's a saved email
const savedEmail = localStorage.getItem('rememberedEmail');
if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
}

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

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/popup-closed-by-user':
            return 'Sign in was cancelled.';
        default:
            return 'An error occurred. Please try again.';
    }
}

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPyEBGDaOFeWNI7HnYmRe1XMjWVX_LIL0",
    authDomain: "smartfin-5c89b.firebaseapp.com",
    projectId: "smartfin-5c89b",
    storageBucket: "smartfin-5c89b.appspot.com",
    messagingSenderId: "378095667140",
    appId: "1:378095667140:web:a08fae7cc6e83f0c3a1b84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

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
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Clear any existing errors
    clearError('email');
    clearError('password');
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in successfully:', userCredential.user);
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
document.getElementById('google-login').addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Google sign in successful:', result.user);
        // Redirect to home page
        window.location.href = '../home/home.html';
    } catch (error) {
        console.error('Google sign in error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
            showError('email', 'Sign in cancelled');
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
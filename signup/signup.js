// Import theme configuration
import { initializeTheme } from '../shared/theme-config.js';

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

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

// DOM Elements
const signupForm = document.getElementById('signup-form');
const firstnameInput = document.getElementById('firstname');
const lastnameInput = document.getElementById('lastname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const togglePassword = document.getElementById('toggle-password');
const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
const googleSignUpButton = document.getElementById('google-signup');
const termsCheckbox = document.getElementById('terms');

// Error elements
const firstnameError = document.getElementById('firstname-error');
const lastnameError = document.getElementById('lastname-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const termsError = document.getElementById('terms-error');

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();

    // Password Toggle Functionality
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    // Password field toggle
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
    
    // Confirm password field toggle
    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            
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
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = `${firstnameInput.value} ${lastnameInput.value}`;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const terms = termsCheckbox.checked;
    
    // Clear any existing errors
    clearError('firstname');
    clearError('lastname');
    clearError('email');
    clearError('phone');
    clearError('password');
    clearError('confirm-password');
    
    // Validate form
    if (!name.trim()) {
        showError('firstname', 'Name is required');
        return;
    }
    
    if (!terms) {
        showError('terms', 'Please accept the Terms of Service and Privacy Policy');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('confirm-password', 'Passwords do not match');
        return;
    }
    
    try {
        console.log('Attempting to create user with email:', email);
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User created successfully:', user.uid);
        
        // Update user profile
        await user.updateProfile({
            displayName: name,
            photoURL: null // You can add a default avatar URL here
        });
        console.log('User profile updated successfully');
        
        // Store additional user data in Firestore (if you're using it)
        // await firebase.firestore().collection('users').doc(user.uid).set({
        //     firstname: firstnameInput.value,
        //     lastname: lastnameInput.value,
        //     email: emailInput.value,
        //     phone: phoneInput.value,
        //     createdAt: firebase.firestore.FieldValue.serverTimestamp()
        // });
        
        // Redirect to home page
        window.location.href = '../home/home.html';
    } catch (error) {
        console.error('Signup error:', error);
        switch (error.code) {
            case 'auth/email-already-in-use':
                showError('email', 'Email already in use');
                break;
            case 'auth/invalid-email':
                showError('email', 'Invalid email address');
                break;
            case 'auth/weak-password':
                showError('password', 'Password should be at least 6 characters');
                break;
            default:
                showError('email', 'An error occurred. Please try again');
        }
    }
});

// Handle Google Sign Up
googleSignUpButton.addEventListener('click', async () => {
    try {
        console.log('Attempting Google sign up');
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log('Google sign up successful:', user.uid);
        
        // Redirect to home page
        window.location.href = '../home/home.html';
    } catch (error) {
        console.error('Google sign up error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
            showError('email', 'Sign up cancelled');
        } else {
            showError('email', 'Could not sign up with Google. Please try again');
        }
    }
});

// Add animation to the signup card
document.addEventListener('DOMContentLoaded', () => {
    const signupCard = document.querySelector('.signup-card');
    signupCard.style.opacity = '0';
    signupCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        signupCard.style.transition = 'all 0.5s ease';
        signupCard.style.opacity = '1';
        signupCard.style.transform = 'translateY(0)';
    }, 100);
}); 
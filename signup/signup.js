// Import theme configuration
import { initializeTheme } from '../shared/theme-config.js';
import { auth, googleProvider } from '../firebase-config/firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithPopup,
    updateProfile 
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

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
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    
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
    
    const firstname = firstnameInput.value.trim();
    const lastname = lastnameInput.value.trim();
    const name = `${firstname} ${lastname}`;
    const email = emailInput.value.trim();
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
    if (!firstname) {
        showError('firstname', 'First name is required');
        return;
    }

    if (!lastname) {
        showError('lastname', 'Last name is required');
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
        console.log('User created successfully:', userCredential.user);
        
        // Update user profile
        await updateProfile(userCredential.user, {
            displayName: name
        });
        console.log('User profile updated successfully');
        
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
document.getElementById('google-signup').addEventListener('click', async () => {
    try {
        // Clear any existing errors
        clearError('firstname');
        clearError('lastname');
        clearError('email');
        clearError('phone');
        clearError('password');
        clearError('confirm-password');
        
        console.log('Attempting Google sign up...');
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Google sign up successful:', result.user);
        
        // Redirect to home page
        window.location.href = '../home/home.html';
    } catch (error) {
        console.error('Google sign up error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
            showError('email', 'Sign up cancelled');
        } else if (error.code === 'auth/popup-blocked') {
            showError('email', 'Pop-up blocked by browser. Please allow pop-ups for this site');
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
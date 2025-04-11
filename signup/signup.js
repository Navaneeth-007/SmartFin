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
const themeSwitch = document.getElementById('checkbox');
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
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    // Theme switch handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

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

// Handle form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordError.textContent = 'Passwords do not match';
        confirmPasswordError.style.display = 'block';
        return;
    }
    
    try {
        console.log('Attempting to create user with email:', emailInput.value);
        
        // Create user with email and password
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(
            emailInput.value,
            passwordInput.value
        );
        const user = userCredential.user;
        console.log('User created successfully:', user.uid);
        
        // Update user profile
        await user.updateProfile({
            displayName: `${firstnameInput.value} ${lastnameInput.value}`,
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
        emailError.textContent = getErrorMessage(error.code);
        emailError.style.display = 'block';
    }
});

// Handle Google Sign Up
googleSignUpButton.addEventListener('click', async () => {
    try {
        console.log('Attempting Google sign up');
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        console.log('Google sign up successful:', user.uid);
        
        // Redirect to home page
        window.location.href = '../home/home.html';
    } catch (error) {
        console.error('Google sign up error:', error);
        emailError.textContent = getErrorMessage(error.code);
        emailError.style.display = 'block';
    }
});

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered.';
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled.';
        case 'auth/weak-password':
            return 'Password is too weak.';
        case 'auth/popup-closed-by-user':
            return 'Sign up was cancelled.';
        default:
            return 'An error occurred. Please try again.';
    }
}

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
// Theme Switcher
const themeToggle = document.getElementById('checkbox');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeToggle.checked = savedTheme === 'dark';

// Theme switch handler
themeToggle.addEventListener('change', () => {
    const theme = themeToggle.checked ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update the theme for the entire document
    document.documentElement.setAttribute('data-theme', theme);
});

// Password visibility toggle
const togglePassword = document.getElementById('toggle-password');
const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle eye icon
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    
    // Toggle eye icon
    const icon = toggleConfirmPassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// Form validation
const signupForm = document.getElementById('signup-form');
const firstnameInput = document.getElementById('firstname');
const lastnameInput = document.getElementById('lastname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const termsCheckbox = document.getElementById('terms');

const firstnameError = document.getElementById('firstname-error');
const lastnameError = document.getElementById('lastname-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const termsError = document.getElementById('terms-error');

// Password strength meter
const strengthMeterFill = document.getElementById('strength-meter-fill');
const strengthText = document.getElementById('strength-text');

// Validation functions
function validateFirstname(firstname) {
    return firstname.trim().length >= 2;
}

function validateLastname(lastname) {
    return lastname.trim().length >= 2;
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    // Allow various phone formats
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone).replace(/\s/g, ''));
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Update strength meter
    if (strength <= 2) {
        strengthMeterFill.style.width = '33%';
        strengthMeterFill.style.backgroundColor = 'var(--weak-password)';
        strengthText.textContent = 'Weak password';
        strengthText.style.color = 'var(--weak-password)';
        return 'weak';
    } else if (strength <= 4) {
        strengthMeterFill.style.width = '66%';
        strengthMeterFill.style.backgroundColor = 'var(--medium-password)';
        strengthText.textContent = 'Medium password';
        strengthText.style.color = 'var(--medium-password)';
        return 'medium';
    } else {
        strengthMeterFill.style.width = '100%';
        strengthMeterFill.style.backgroundColor = 'var(--strong-password)';
        strengthText.textContent = 'Strong password';
        strengthText.style.color = 'var(--strong-password)';
        return 'strong';
    }
}

// Real-time validation
firstnameInput.addEventListener('input', () => {
    if (firstnameInput.value.trim() === '') {
        firstnameError.textContent = 'First name is required';
    } else if (!validateFirstname(firstnameInput.value)) {
        firstnameError.textContent = 'First name must be at least 2 characters';
    } else {
        firstnameError.textContent = '';
    }
});

lastnameInput.addEventListener('input', () => {
    if (lastnameInput.value.trim() === '') {
        lastnameError.textContent = 'Last name is required';
    } else if (!validateLastname(lastnameInput.value)) {
        lastnameError.textContent = 'Last name must be at least 2 characters';
    } else {
        lastnameError.textContent = '';
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email is required';
    } else if (!validateEmail(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
    } else {
        emailError.textContent = '';
    }
});

phoneInput.addEventListener('input', () => {
    if (phoneInput.value.trim() === '') {
        phoneError.textContent = 'Phone number is required';
    } else if (!validatePhone(phoneInput.value)) {
        phoneError.textContent = 'Please enter a valid phone number';
    } else {
        phoneError.textContent = '';
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.trim() === '') {
        passwordError.textContent = 'Password is required';
        strengthMeterFill.style.width = '0';
        strengthText.textContent = 'Password strength';
        strengthText.style.color = 'var(--text-secondary)';
    } else if (!validatePassword(passwordInput.value)) {
        passwordError.textContent = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        checkPasswordStrength(passwordInput.value);
    } else {
        passwordError.textContent = '';
        checkPasswordStrength(passwordInput.value);
    }
    
    // Check if passwords match
    if (confirmPasswordInput.value.trim() !== '') {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'Passwords do not match';
        } else {
            confirmPasswordError.textContent = '';
        }
    }
});

confirmPasswordInput.addEventListener('input', () => {
    if (confirmPasswordInput.value.trim() === '') {
        confirmPasswordError.textContent = 'Please confirm your password';
    } else if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordError.textContent = 'Passwords do not match';
    } else {
        confirmPasswordError.textContent = '';
    }
});

termsCheckbox.addEventListener('change', () => {
    if (!termsCheckbox.checked) {
        termsError.textContent = 'You must agree to the Terms of Service and Privacy Policy';
    } else {
        termsError.textContent = '';
    }
});

// Form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    
    if (firstnameInput.value.trim() === '') {
        firstnameError.textContent = 'First name is required';
        isValid = false;
    } else if (!validateFirstname(firstnameInput.value)) {
        firstnameError.textContent = 'First name must be at least 2 characters';
        isValid = false;
    } else {
        firstnameError.textContent = '';
    }
    
    if (lastnameInput.value.trim() === '') {
        lastnameError.textContent = 'Last name is required';
        isValid = false;
    } else if (!validateLastname(lastnameInput.value)) {
        lastnameError.textContent = 'Last name must be at least 2 characters';
        isValid = false;
    } else {
        lastnameError.textContent = '';
    }
    
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    } else {
        emailError.textContent = '';
    }
    
    if (phoneInput.value.trim() === '') {
        phoneError.textContent = 'Phone number is required';
        isValid = false;
    } else if (!validatePhone(phoneInput.value)) {
        phoneError.textContent = 'Please enter a valid phone number';
        isValid = false;
    } else {
        phoneError.textContent = '';
    }
    
    if (passwordInput.value.trim() === '') {
        passwordError.textContent = 'Password is required';
        isValid = false;
    } else if (!validatePassword(passwordInput.value)) {
        passwordError.textContent = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        isValid = false;
    } else {
        passwordError.textContent = '';
    }
    
    if (confirmPasswordInput.value.trim() === '') {
        confirmPasswordError.textContent = 'Please confirm your password';
        isValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordError.textContent = 'Passwords do not match';
        isValid = false;
    } else {
        confirmPasswordError.textContent = '';
    }
    
    if (!termsCheckbox.checked) {
        termsError.textContent = 'You must agree to the Terms of Service and Privacy Policy';
        isValid = false;
    } else {
        termsError.textContent = '';
    }
    
    if (isValid) {
        // Show loading state
        const signupButton = signupForm.querySelector('.signup-button');
        signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        signupButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, we'll just redirect to the login page
            // In a real application, you would make an API call to register the user
            window.location.href = '../login/login.html';
        }, 1500);
    }
});

// Add animation to the signup card
document.addEventListener('DOMContentLoaded', () => {
    const signupCard = document.querySelector('.signup-card');
    signupCard.style.opacity = '0';
    signupCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        signupCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        signupCard.style.opacity = '1';
        signupCard.style.transform = 'translateY(0)';
    }, 100);
});

// Google Sign Up
const googleSignUpButton = document.getElementById('google-signup');

googleSignUpButton.addEventListener('click', () => {
    // Show loading state
    googleSignUpButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    googleSignUpButton.disabled = true;
    
    // Simulate Google Sign Up
    setTimeout(() => {
        // For demo purposes, we'll just redirect to the login page
        // In a real application, you would implement Google OAuth
        window.location.href = '../login/login.html';
    }, 1500);
}); 
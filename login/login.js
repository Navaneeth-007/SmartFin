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
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle eye icon
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// Form validation
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
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

// Form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    } else {
        emailError.textContent = '';
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
    
    if (isValid) {
        // Show loading state
        const loginButton = loginForm.querySelector('.login-button');
        const originalButtonText = loginButton.innerHTML;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        loginButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, we'll just redirect to the home page
            // In a real application, you would make an API call to authenticate
            window.location.href = '../home/home.html';
        }, 1500);
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

// Save email when form is submitted
loginForm.addEventListener('submit', () => {
    if (rememberCheckbox.checked) {
        localStorage.setItem('rememberedEmail', emailInput.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});

// Add animation to the login card
document.addEventListener('DOMContentLoaded', () => {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.opacity = '0';
    loginCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        loginCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        loginCard.style.opacity = '1';
        loginCard.style.transform = 'translateY(0)';
    }, 100);
});

// Google Sign In
const googleSignInButton = document.getElementById('google-signin');

googleSignInButton.addEventListener('click', () => {
    // Show loading state
    googleSignInButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    googleSignInButton.disabled = true;
    
    // Simulate Google Sign In
    setTimeout(() => {
        // For demo purposes, we'll just redirect to the home page
        // In a real application, you would implement Google OAuth
        window.location.href = '../home/home.html';
    }, 1500);
}); 
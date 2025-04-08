// Function to update user profile in the navigation bar
function updateUserProfile() {
    const user = firebase.auth().currentUser;
    const profileContainer = document.querySelector('.profile-container');
    
    if (user) {
        // User is signed in
        const displayName = user.displayName || user.email.split('@')[0];
        const photoURL = user.photoURL || 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/anonymous.png';
        
        profileContainer.innerHTML = `
            <div class="profile-dropdown">
                <button class="profile-button">
                    <img src="${photoURL}" alt="Profile" class="profile-image">
                    <span class="profile-name">${displayName}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu">
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-user"></i>
                        Profile
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-cog"></i>
                        Settings
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" id="logout-button">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </a>
                </div>
            </div>
        `;

        // Add event listeners for dropdown
        const profileButton = profileContainer.querySelector('.profile-button');
        const dropdownMenu = profileContainer.querySelector('.dropdown-menu');
        const logoutButton = profileContainer.querySelector('#logout-button');

        profileButton.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileContainer.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });

        // Handle logout
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            firebase.auth().signOut().then(() => {
                window.location.href = '../login/login.html';
            }).catch((error) => {
                console.error('Error signing out:', error);
            });
        });
    } else {
        // User is signed out
        profileContainer.innerHTML = `
            <a href="../login/login.html" class="login-link">
                <i class="fas fa-sign-in-alt"></i>
                Login
            </a>
        `;
    }
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        updateUserProfile();
    } else {
        // User is signed out
        updateUserProfile();
    }
}); 
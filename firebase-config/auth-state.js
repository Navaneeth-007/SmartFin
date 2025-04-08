// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.uid);
        console.log('User email:', user.email);
        console.log('User display name:', user.displayName);
        
        // Store user info in sessionStorage
        sessionStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));
    } else {
        // User is signed out
        console.log('User is signed out');
        sessionStorage.removeItem('user');
        
        // Redirect to login page if not already there
        const currentPath = window.location.pathname;
        if (!currentPath.includes('login.html') && !currentPath.includes('signup.html')) {
            window.location.href = '../login/login.html';
        }
    }
}); 
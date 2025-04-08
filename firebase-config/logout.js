// Logout function
function logout() {
    firebase.auth().signOut()
        .then(() => {
            // Sign-out successful
            console.log("User signed out");
            window.location.href = '../login/login.html';
        })
        .catch((error) => {
            // An error happened
            console.error("Error signing out:", error);
            alert('An error occurred during sign out. Please try again.');
        });
} 
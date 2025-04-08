// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXK-0FKH1hC-LiEASaIWolvxqk-2MnbWI",
  authDomain: "smartfin-40e30.firebaseapp.com",
  projectId: "smartfin-40e30",
  storageBucket: "smartfin-40e30.firebasestorage.app",
  messagingSenderId: "14976464670",
  appId: "1:14976464670:web:98756ac774dc67b3613b0f",
};

// Initialize Firebase
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    console.log('Firebase already initialized');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Export firebase instance
window.firebase = firebase;

// Debug function to check Firebase status
function checkFirebaseStatus() {
  console.log('Firebase apps:', firebase.apps.length);
  console.log('Firebase auth available:', !!firebase.auth);
  console.log('Firebase config:', firebaseConfig);
}

// Call the debug function
checkFirebaseStatus();

// Initialize Firebase Authentication
const auth = firebase.auth(); 
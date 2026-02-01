// Firebase Configuration
// Get credentials from config.js which is loaded before this file
// Do NOT define firebaseConfig here - use the one from config.js

let app, auth, db, analytics;

function initializeFirebase() {
  try {
    // Use the Firebase config from config.js (window.config.firebase)
    const firebaseConfig = window.config && window.config.firebase 
      ? window.config.firebase 
      : null;
    
    if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_')) {
      console.error("❌ Firebase credentials not properly configured in config.js");
      return false;
    }
    
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Optional: Initialize Analytics
    if (firebaseConfig.measurementId) {
      analytics = firebase.analytics();
    }
    
    console.log("✅ Firebase initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
    return false;
  }
}

// User state management callbacks
function onUserLoggedIn(user) {
  window.currentUser = user;
  
  // Update UI to show user info
  if (document.getElementById('auth-section')) {
    document.getElementById('auth-section').style.display = 'none';
  }
  if (document.getElementById('user-profile')) {
    document.getElementById('user-profile').style.display = 'block';
    document.getElementById('user-email').textContent = user.email;
  }
  
  // Load user data
  loadUserData(user.uid);
}

function onUserLoggedOut() {
  window.currentUser = null;
  
  // Update UI to show login
  if (document.getElementById('auth-section')) {
    document.getElementById('auth-section').style.display = 'block';
  }
  if (document.getElementById('user-profile')) {
    document.getElementById('user-profile').style.display = 'none';
  }
}

// Load user data from Firestore
async function loadUserData(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (userDoc.exists) {
      window.userData = userDoc.data();
      console.log("User data loaded:", window.userData);
      
      // Trigger UI updates
      if (typeof updateDashboard === 'function') {
        updateDashboard(window.userData);
      }
    } else {
      // Create new user document
      await createNewUser(userId);
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

// Create new user document
async function createNewUser(userId) {
  const newUserData = {
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    email: auth.currentUser.email,
    subscription: {
      status: 'free',
      plan: 'free',
      startDate: null,
      endDate: null
    },
    kids: [],
    settings: {
      soundEnabled: true,
      musicEnabled: false,
      language: 'en'
    }
  };
  
  try {
    await db.collection('users').doc(userId).set(newUserData);
    window.userData = newUserData;
    console.log("New user created:", userId);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

// Initialize Firebase when DOM is ready
// Only set up UI listeners if we're on the home page (index.html)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
    // Only set up auth listener if auth-section exists (meaning we're on home page)
    if (document.getElementById('auth-section')) {
      setupHomePageAuthListener();
    }
  });
} else {
  initializeFirebase();
  if (document.getElementById('auth-section')) {
    setupHomePageAuthListener();
  }
}

// Set up auth state listener for home page only
function setupHomePageAuthListener() {
  if (typeof auth === 'undefined') return;
  
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("User logged in:", user.email);
      onUserLoggedIn(user);
    } else {
      console.log("No user logged in");
      onUserLoggedOut();
    }
  });
}

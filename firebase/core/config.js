/**
 * Firebase Configuration Module
 * Handles Firebase initialization and core setup
 * 
 * @module firebase/core/config
 */

const FirebaseConfig = (function() {
  'use strict';

  // Private variables
  let app = null;
  let auth = null;
  let db = null;
  let analytics = null;
  let isInitialized = false;

  /**
   * Initialize Firebase with configuration
   * @returns {boolean} Success status
   */
  function initialize() {
    if (isInitialized) {
      console.warn('Firebase already initialized');
      return true;
    }

    // Check if config exists
    if (typeof window.config === 'undefined' || !window.config.firebase) {
      console.error('❌ Firebase configuration not found. Please create config.js from config.template.js');
      return false;
    }

    const firebaseConfig = window.config.firebase;

    try {
      // Initialize Firebase
      app = firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      db = firebase.firestore();
      
      // Optional: Initialize Analytics
      if (firebaseConfig.measurementId) {
        analytics = firebase.analytics();
      }
      
      isInitialized = true;
      console.log('✅ Firebase initialized successfully');
      
      // Set up authentication state observer
      setupAuthStateObserver();
      
      return true;
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
      return false;
    }
  }

  /**
   * Set up authentication state observer
   * @private
   */
  function setupAuthStateObserver() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User logged in:', user.email);
        handleUserLoggedIn(user);
      } else {
        console.log('No user logged in');
        handleUserLoggedOut();
      }
    });
  }

  /**
   * Handle user logged in event
   * @private
   * @param {Object} user - Firebase user object
   */
  function handleUserLoggedIn(user) {
    window.currentUser = user;
    
    // Update UI
    updateAuthUI(true, user);
    
    // Load user data
    if (typeof UserService !== 'undefined') {
      UserService.loadUserData(user.uid);
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { user } }));
  }

  /**
   * Handle user logged out event
   * @private
   */
  function handleUserLoggedOut() {
    window.currentUser = null;
    window.userData = null;
    
    // Update UI
    updateAuthUI(false, null);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  }

  /**
   * Update authentication UI
   * @private
   * @param {boolean} isLoggedIn - Whether user is logged in
   * @param {Object|null} user - User object if logged in
   */
  function updateAuthUI(isLoggedIn, user) {
    const authSection = document.getElementById('auth-section');
    const userProfile = document.getElementById('user-profile');
    const userEmail = document.getElementById('user-email');
    
    if (authSection) {
      authSection.style.display = isLoggedIn ? 'none' : 'flex';
    }
    
    if (userProfile) {
      userProfile.style.display = isLoggedIn ? 'block' : 'none';
      if (userEmail && user) {
        userEmail.textContent = user.email;
      }
    }
  }

  /**
   * Get Firebase Auth instance
   * @returns {Object|null} Firebase Auth instance
   */
  function getAuth() {
    if (!isInitialized) {
      console.error('Firebase not initialized. Call initialize() first.');
      return null;
    }
    return auth;
  }

  /**
   * Get Firestore instance
   * @returns {Object|null} Firestore instance
   */
  function getFirestore() {
    if (!isInitialized) {
      console.error('Firebase not initialized. Call initialize() first.');
      return null;
    }
    return db;
  }

  /**
   * Get Analytics instance
   * @returns {Object|null} Firebase Analytics instance
   */
  function getAnalytics() {
    return analytics;
  }

  /**
   * Get Firebase App instance
   * @returns {Object|null} Firebase App instance
   */
  function getApp() {
    return app;
  }

  /**
   * Check if Firebase is initialized
   * @returns {boolean} Initialization status
   */
  function isReady() {
    return isInitialized;
  }

  // Public API
  return {
    initialize,
    getAuth,
    getFirestore,
    getAnalytics,
    getApp,
    isReady
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => FirebaseConfig.initialize());
} else {
  FirebaseConfig.initialize();
}

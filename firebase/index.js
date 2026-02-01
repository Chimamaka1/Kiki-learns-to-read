/**
 * Firebase Main Entry Point
 * Loads all Firebase modules in correct order
 * 
 * @module firebase/index
 */

(function() {
  'use strict';

  console.log('🚀 Loading Firebase Backend...');

  // Check if Firebase SDK is loaded
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK not loaded. Please include Firebase scripts in your HTML.');
    return;
  }

  // Initialize Firebase when all modules are loaded
  window.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Firebase Backend loaded successfully');
  });

  // Global error handler for Firebase operations
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.code && event.reason.code.startsWith('auth/')) {
      console.error('Firebase Auth Error:', event.reason);
      FirebaseHelpers.showMessage(getFriendlyErrorMessage(event.reason.code), 'error');
      event.preventDefault();
    }
  });

  /**
   * Get friendly error messages
   * @private
   * @param {string} errorCode - Firebase error code
   * @returns {string} Friendly error message
   */
  function getFriendlyErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in cancelled.',
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }

  // Expose global API for backward compatibility
  window.Firebase = {
    Config: FirebaseConfig,
    Auth: AuthService,
    User: UserService,
    Kid: KidService,
    Progress: ProgressService,
    Subscription: SubscriptionService,
    Storage: StorageUtil,
    Helpers: FirebaseHelpers
  };

  console.log('📦 Firebase API available at window.Firebase');
})();

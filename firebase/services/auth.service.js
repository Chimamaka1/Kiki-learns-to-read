/**
 * Authentication Service
 * Handles all authentication operations
 * 
 * @module firebase/services/auth
 */

const AuthService = (function() {
  'use strict';

  /**
   * Sign up with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} displayName - Optional display name
   * @returns {Promise<Object>} Result object with success status
   */
  async function signUp(email, password, displayName = '') {
    const auth = FirebaseConfig.getAuth();
    if (!auth) return { success: false, error: 'Firebase not initialized' };

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update profile with display name if provided
      if (displayName) {
        await user.updateProfile({ displayName });
      }
      
      console.log('✅ User created successfully:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Result object with success status
   */
  async function signIn(email, password) {
    const auth = FirebaseConfig.getAuth();
    if (!auth) return { success: false, error: 'Firebase not initialized' };

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      console.log('✅ User signed in:', userCredential.user.email);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign in with Google
   * @returns {Promise<Object>} Result object with success status
   */
  async function signInWithGoogle() {
    const auth = FirebaseConfig.getAuth();
    if (!auth) return { success: false, error: 'Firebase not initialized' };

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      console.log('✅ Signed in with Google:', result.user.email);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ Google sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign out current user
   * @returns {Promise<Object>} Result object with success status
   */
  async function signOut() {
    const auth = FirebaseConfig.getAuth();
    if (!auth) return { success: false, error: 'Firebase not initialized' };

    try {
      await auth.signOut();
      console.log('✅ User signed out');
      return { success: true };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} Result object with success status
   */
  async function resetPassword(email) {
    const auth = FirebaseConfig.getAuth();
    if (!auth) return { success: false, error: 'Firebase not initialized' };

    try {
      await auth.sendPasswordResetEmail(email);
      console.log('✅ Password reset email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('❌ Password reset error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} Current user or null
   */
  function getCurrentUser() {
    const auth = FirebaseConfig.getAuth();
    return auth ? auth.currentUser : null;
  }

  /**
   * Check if user is logged in
   * @returns {boolean} Login status
   */
  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  // Public API
  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    getCurrentUser,
    isLoggedIn
  };
})();

/**
 * User Service
 * Manages user profiles and data
 * 
 * @module firebase/services/user
 */

const UserService = (function() {
  'use strict';

  /**
   * Load user data from Firestore
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async function loadUserData(userId) {
    const db = FirebaseConfig.getFirestore();
    if (!db) return null;

    try {
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (userDoc.exists) {
        window.userData = userDoc.data();
        console.log('User data loaded:', window.userData);
        
        // Trigger UI updates
        updateDashboard(window.userData);
        
        return window.userData;
      } else {
        // Create new user document
        return await createNewUser(userId);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  /**
   * Create new user document
   * @private
   * @param {string} userId - User ID
   * @returns {Promise<Object>} New user data
   */
  async function createNewUser(userId) {
    const db = FirebaseConfig.getFirestore();
    const auth = FirebaseConfig.getAuth();
    if (!db || !auth) return null;

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
      console.log('New user created:', userId);
      return newUserData;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  /**
   * Update user settings
   * @param {Object} settings - Settings to update
   * @returns {Promise<Object>} Result object
   */
  async function updateSettings(settings) {
    const auth = FirebaseConfig.getAuth();
    const db = FirebaseConfig.getFirestore();
    if (!auth || !db || !auth.currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const userId = auth.currentUser.uid;

    try {
      await db.collection('users').doc(userId).update({
        settings: { ...window.userData.settings, ...settings }
      });
      
      // Update local data
      window.userData.settings = { ...window.userData.settings, ...settings };
      
      return { success: true };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update dashboard UI with user data
   * @private
   * @param {Object} userData - User data
   */
  function updateDashboard(userData) {
    // Dispatch event for dashboard to listen to
    window.dispatchEvent(new CustomEvent('userDataLoaded', { 
      detail: { userData } 
    }));
  }

  /**
   * Get user data
   * @returns {Object|null} Current user data
   */
  function getUserData() {
    return window.userData || null;
  }

  // Public API
  return {
    loadUserData,
    updateSettings,
    getUserData
  };
})();

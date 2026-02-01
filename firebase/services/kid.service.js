/**
 * Kid Profile Service
 * Manages kid profiles and their data
 * 
 * @module firebase/services/kid
 */

const KidService = (function() {
  'use strict';

  /**
   * Add a new kid profile
   * @param {Object} kidData - Kid profile data
   * @param {string} kidData.name - Kid's name
   * @param {number} kidData.age - Kid's age
   * @param {string} kidData.avatar - Avatar identifier
   * @returns {Promise<Object>} Result object with kid data
   */
  async function addKidProfile(kidData) {
    const auth = FirebaseConfig.getAuth();
    const db = FirebaseConfig.getFirestore();
    
    if (!auth || !auth.currentUser) {
      return { success: false, error: 'Please log in first' };
    }
    
    const userId = auth.currentUser.uid;
    const kidProfile = {
      id: generateKidId(),
      name: kidData.name,
      age: kidData.age || null,
      avatar: kidData.avatar || 'default',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      progress: {
        readingSkills: { level: 1, gamesCompleted: 0, stars: 0 },
        numbersAndMaths: { level: 1, gamesCompleted: 0, stars: 0 },
        logicAndThinking: { level: 1, gamesCompleted: 0, stars: 0 },
        creativity: { level: 1, gamesCompleted: 0, stars: 0 }
      },
      stats: {
        totalPlayTime: 0,
        totalGamesPlayed: 0,
        favoriteGames: []
      }
    };
    
    try {
      await db.collection('users').doc(userId).update({
        kids: firebase.firestore.FieldValue.arrayUnion(kidProfile)
      });
      
      console.log('✅ Kid profile added:', kidProfile.name);
      return { success: true, kid: kidProfile };
    } catch (error) {
      console.error('❌ Error adding kid profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all kid profiles for current user
   * @returns {Promise<Object>} Result with kids array
   */
  async function getKidProfiles() {
    const auth = FirebaseConfig.getAuth();
    const db = FirebaseConfig.getFirestore();
    
    if (!auth || !auth.currentUser) {
      return { success: false, error: 'Please log in first' };
    }
    
    const userId = auth.currentUser.uid;
    
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const kids = userDoc.data().kids || [];
        return { success: true, kids };
      }
      return { success: true, kids: [] };
    } catch (error) {
      console.error('❌ Error getting kid profiles:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update kid profile
   * @param {string} kidId - Kid ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Result object
   */
  async function updateKidProfile(kidId, updates) {
    const auth = FirebaseConfig.getAuth();
    const db = FirebaseConfig.getFirestore();
    
    if (!auth || !auth.currentUser) {
      return { success: false, error: 'Please log in first' };
    }
    
    const userId = auth.currentUser.uid;
    
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return { success: false, error: 'User not found' };
      }
      
      const kids = userDoc.data().kids || [];
      const kidIndex = kids.findIndex(k => k.id === kidId);
      
      if (kidIndex === -1) {
        return { success: false, error: 'Kid profile not found' };
      }
      
      kids[kidIndex] = { ...kids[kidIndex], ...updates };
      
      await db.collection('users').doc(userId).update({ kids });
      
      console.log('✅ Kid profile updated:', kidId);
      return { success: true, kid: kids[kidIndex] };
    } catch (error) {
      console.error('❌ Error updating kid profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get kid by ID
   * @param {string} kidId - Kid ID
   * @returns {Promise<Object|null>} Kid data or null
   */
  async function getKidById(kidId) {
    const result = await getKidProfiles();
    if (result.success) {
      const kid = result.kids.find(k => k.id === kidId);
      return kid || null;
    }
    return null;
  }

  /**
   * Delete kid profile
   * @param {string} kidId - Kid ID
   * @returns {Promise<Object>} Result object
   */
  async function deleteKidProfile(kidId) {
    const auth = FirebaseConfig.getAuth();
    const db = FirebaseConfig.getFirestore();
    
    if (!auth || !auth.currentUser) {
      return { success: false, error: 'Please log in first' };
    }
    
    const userId = auth.currentUser.uid;
    
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return { success: false, error: 'User not found' };
      }
      
      const kids = userDoc.data().kids || [];
      const filteredKids = kids.filter(k => k.id !== kidId);
      
      await db.collection('users').doc(userId).update({ kids: filteredKids });
      
      console.log('✅ Kid profile deleted:', kidId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting kid profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate unique kid ID
   * @private
   * @returns {string} Unique ID
   */
  function generateKidId() {
    return 'kid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Public API
  return {
    addKidProfile,
    getKidProfiles,
    updateKidProfile,
    getKidById,
    deleteKidProfile
  };
})();

/**
 * Progress Tracking Service
 * Handles game progress and session tracking
 * 
 * @module firebase/services/progress
 */

const ProgressService = (function() {
  'use strict';

  /**
   * Save game progress
   * @param {string} kidId - Kid ID
   * @param {Object} gameData - Game session data
   * @returns {Promise<Object>} Result object
   */
  async function saveGameProgress(kidId, gameData) {
    const auth = FirebaseConfig.getAuth();
    const db = FirebaseConfig.getFirestore();
    
    if (!auth || !auth.currentUser) {
      return { success: false, error: 'Please log in first' };
    }
    
    const userId = auth.currentUser.uid;
    const gameRecord = {
      kidId,
      userId,
      gameId: gameData.gameId,
      gameName: gameData.gameName,
      category: gameData.category,
      score: gameData.score || 0,
      stars: gameData.stars || 0,
      completed: gameData.completed || false,
      duration: gameData.duration || 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
      // Add to game_sessions collection
      const sessionRef = await db.collection('game_sessions').add(gameRecord);
      
      // Update kid's progress
      await updateKidProgress(kidId, gameData);
      
      console.log('✅ Game progress saved:', sessionRef.id);
      return { success: true, sessionId: sessionRef.id };
    } catch (error) {
      console.error('❌ Error saving game progress:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update kid's overall progress
   * @private
   * @param {string} kidId - Kid ID
   * @param {Object} gameData - Game data
   */
  async function updateKidProgress(kidId, gameData) {
    const auth = FirebaseConfig.getAuth();
    const db = FirebaseConfig.getFirestore();
    const userId = auth.currentUser.uid;
    
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      const kids = userDoc.data().kids || [];
      const kidIndex = kids.findIndex(k => k.id === kidId);
      
      if (kidIndex === -1) return;
      
      const kid = kids[kidIndex];
      const category = gameData.category;
      
      // Update category progress
      if (kid.progress[category]) {
        kid.progress[category].gamesCompleted++;
        kid.progress[category].stars += gameData.stars || 0;
        
        // Level up logic (every 5 games)
        if (kid.progress[category].gamesCompleted % 5 === 0) {
          kid.progress[category].level++;
        }
      }
      
      // Update stats
      kid.stats.totalGamesPlayed++;
      kid.stats.totalPlayTime += gameData.duration || 0;
      
      // Update favorite games
      updateFavoriteGames(kid, gameData);
      
      kids[kidIndex] = kid;
      await db.collection('users').doc(userId).update({ kids });
      
    } catch (error) {
      console.error('❌ Error updating kid progress:', error);
    }
  }

  /**
   * Update favorite games list
   * @private
   * @param {Object} kid - Kid object
   * @param {Object} gameData - Game data
   */
  function updateFavoriteGames(kid, gameData) {
    const gameId = gameData.gameId;
    const favIndex = kid.stats.favoriteGames.findIndex(g => g.id === gameId);
    
    if (favIndex !== -1) {
      kid.stats.favoriteGames[favIndex].playCount++;
    } else if (kid.stats.favoriteGames.length < 5) {
      kid.stats.favoriteGames.push({ 
        id: gameId, 
        name: gameData.gameName, 
        playCount: 1 
      });
    }
  }

  /**
   * Get game history for a kid
   * @param {string} kidId - Kid ID
   * @param {number} limit - Number of records to fetch
   * @returns {Promise<Object>} Result with history array
   */
  async function getGameHistory(kidId, limit = 20) {
    const auth = FirebaseConfig.getAuth();
    const db = FirebaseConfig.getFirestore();
    
    if (!auth || !auth.currentUser) {
      return { success: false, error: 'Please log in first' };
    }
    
    try {
      const sessions = await db.collection('game_sessions')
        .where('kidId', '==', kidId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      const history = [];
      sessions.forEach(doc => {
        history.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, history };
    } catch (error) {
      console.error('❌ Error getting game history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get progress summary for a kid
   * @param {string} kidId - Kid ID
   * @returns {Promise<Object|null>} Progress summary
   */
  async function getProgressSummary(kidId) {
    const kid = await KidService.getKidById(kidId);
    if (!kid) return null;

    return {
      kidId: kid.id,
      name: kid.name,
      progress: kid.progress,
      stats: kid.stats,
      totalStars: Object.values(kid.progress).reduce((sum, cat) => sum + cat.stars, 0),
      averageLevel: Math.round(
        Object.values(kid.progress).reduce((sum, cat) => sum + cat.level, 0) / 4
      )
    };
  }

  // Public API
  return {
    saveGameProgress,
    getGameHistory,
    getProgressSummary
  };
})();

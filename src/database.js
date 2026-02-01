// Firestore Database Functions

// ========================================
// KID PROFILE MANAGEMENT
// ========================================

// Add a new kid profile to user account
async function addKidProfile(kidData) {
  if (!auth.currentUser) {
    console.error("No user logged in");
    return { success: false, error: "Please log in first" };
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
    
    console.log("✅ Kid profile added:", kidProfile.name);
    return { success: true, kid: kidProfile };
  } catch (error) {
    console.error("❌ Error adding kid profile:", error);
    return { success: false, error: error.message };
  }
}

// Get all kid profiles for current user
async function getKidProfiles() {
  if (!auth.currentUser) {
    return { success: false, error: "Please log in first" };
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
    console.error("❌ Error getting kid profiles:", error);
    return { success: false, error: error.message };
  }
}

// Update kid profile
async function updateKidProfile(kidId, updates) {
  if (!auth.currentUser) {
    return { success: false, error: "Please log in first" };
  }
  
  const userId = auth.currentUser.uid;
  
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return { success: false, error: "User not found" };
    }
    
    const kids = userDoc.data().kids || [];
    const kidIndex = kids.findIndex(k => k.id === kidId);
    
    if (kidIndex === -1) {
      return { success: false, error: "Kid profile not found" };
    }
    
    kids[kidIndex] = { ...kids[kidIndex], ...updates };
    
    await db.collection('users').doc(userId).update({ kids });
    
    console.log("✅ Kid profile updated:", kidId);
    return { success: true, kid: kids[kidIndex] };
  } catch (error) {
    console.error("❌ Error updating kid profile:", error);
    return { success: false, error: error.message };
  }
}

// ========================================
// GAME PROGRESS TRACKING
// ========================================

// Save game progress
async function saveGameProgress(kidId, gameData) {
  if (!auth.currentUser) {
    return { success: false, error: "Please log in first" };
  }
  
  const userId = auth.currentUser.uid;
  const gameRecord = {
    kidId,
    userId,
    gameId: gameData.gameId,
    gameName: gameData.gameName,
    category: gameData.category, // reading-skills, numbers-and-maths, logic, creativity
    score: gameData.score || 0,
    stars: gameData.stars || 0,
    completed: gameData.completed || false,
    duration: gameData.duration || 0, // in seconds
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  try {
    // Add to game_sessions collection
    const sessionRef = await db.collection('game_sessions').add(gameRecord);
    
    // Update kid's progress
    await updateKidProgress(kidId, gameData);
    
    console.log("✅ Game progress saved:", sessionRef.id);
    return { success: true, sessionId: sessionRef.id };
  } catch (error) {
    console.error("❌ Error saving game progress:", error);
    return { success: false, error: error.message };
  }
}

// Update kid's overall progress
async function updateKidProgress(kidId, gameData) {
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
    const gameId = gameData.gameId;
    const favIndex = kid.stats.favoriteGames.findIndex(g => g.id === gameId);
    if (favIndex !== -1) {
      kid.stats.favoriteGames[favIndex].playCount++;
    } else if (kid.stats.favoriteGames.length < 5) {
      kid.stats.favoriteGames.push({ id: gameId, name: gameData.gameName, playCount: 1 });
    }
    
    kids[kidIndex] = kid;
    await db.collection('users').doc(userId).update({ kids });
    
  } catch (error) {
    console.error("❌ Error updating kid progress:", error);
  }
}

// Get game history for a kid
async function getGameHistory(kidId, limit = 20) {
  if (!auth.currentUser) {
    return { success: false, error: "Please log in first" };
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
    console.error("❌ Error getting game history:", error);
    return { success: false, error: error.message };
  }
}

// ========================================
// SUBSCRIPTION MANAGEMENT
// ========================================

// Update subscription status
async function updateSubscription(subscriptionData) {
  if (!auth.currentUser) {
    return { success: false, error: "Please log in first" };
  }
  
  const userId = auth.currentUser.uid;
  
  try {
    await db.collection('users').doc(userId).update({
      subscription: {
        status: subscriptionData.status, // 'free', 'active', 'cancelled', 'expired'
        plan: subscriptionData.plan, // 'free', 'monthly', 'yearly'
        startDate: subscriptionData.startDate,
        endDate: subscriptionData.endDate,
        stripeCustomerId: subscriptionData.stripeCustomerId || null,
        stripeSubscriptionId: subscriptionData.stripeSubscriptionId || null
      },
      'subscription.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log("✅ Subscription updated");
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating subscription:", error);
    return { success: false, error: error.message };
  }
}

// Check if user has active subscription
async function hasActiveSubscription() {
  if (!auth.currentUser) {
    return false;
  }
  
  const userId = auth.currentUser.uid;
  
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const subscription = userDoc.data().subscription;
      return subscription && subscription.status === 'active';
    }
    return false;
  } catch (error) {
    console.error("❌ Error checking subscription:", error);
    return false;
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Generate unique kid ID
function generateKidId() {
  return 'kid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get current active kid (stored in localStorage)
function getCurrentKid() {
  const kidId = localStorage.getItem('currentKidId');
  return kidId;
}

// Set current active kid
function setCurrentKid(kidId) {
  localStorage.setItem('currentKidId', kidId);
}

// Get kid data by ID
async function getKidById(kidId) {
  const result = await getKidProfiles();
  if (result.success) {
    const kid = result.kids.find(k => k.id === kidId);
    return kid || null;
  }
  return null;
}

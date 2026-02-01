# Firestore Database Schema

## Overview
This document describes the database structure for Kiki Learns to Read application.

## Collections

### 1. `users` Collection

Root collection storing parent/user account information.

**Document ID:** Firebase Auth UID

```javascript
{
  // User identification
  "email": "parent@example.com",
  "createdAt": Timestamp,
  
  // Subscription information
  "subscription": {
    "status": "free" | "active" | "cancelled" | "expired",
    "plan": "free" | "monthly" | "yearly",
    "startDate": Timestamp | null,
    "endDate": Timestamp | null,
    "stripeCustomerId": "cus_xxxxx" | null,
    "stripeSubscriptionId": "sub_xxxxx" | null,
    "updatedAt": Timestamp
  },
  
  // Kid profiles array
  "kids": [
    {
      "id": "kid_1674567890_abc123",
      "name": "Emma",
      "age": 3,
      "avatar": "default" | "avatar1" | "avatar2",
      "createdAt": Timestamp,
      
      // Progress tracking by category
      "progress": {
        "readingSkills": {
          "level": 1,
          "gamesCompleted": 5,
          "stars": 15
        },
        "numbersAndMaths": {
          "level": 2,
          "gamesCompleted": 10,
          "stars": 28
        },
        "logicAndThinking": {
          "level": 1,
          "gamesCompleted": 3,
          "stars": 9
        },
        "creativity": {
          "level": 1,
          "gamesCompleted": 2,
          "stars": 6
        }
      },
      
      // Statistics
      "stats": {
        "totalPlayTime": 3600,      // in seconds
        "totalGamesPlayed": 20,
        "favoriteGames": [
          {
            "id": "balloon-pop",
            "name": "Balloon Pop",
            "playCount": 8
          }
        ]
      }
    }
  ],
  
  // App settings
  "settings": {
    "soundEnabled": true,
    "musicEnabled": false,
    "language": "en"
  }
}
```

---

### 2. `game_sessions` Collection

Stores individual game play sessions for analytics and progress tracking.

**Document ID:** Auto-generated

```javascript
{
  // User identification
  "userId": "firebase_auth_uid",
  "kidId": "kid_1674567890_abc123",
  
  // Game information
  "gameId": "balloon-pop",
  "gameName": "Balloon Pop",
  "category": "reading-skills" | "numbers-and-maths" | "logic" | "creativity",
  
  // Session data
  "score": 85,
  "stars": 3,              // 0-3 stars based on performance
  "completed": true,
  "duration": 120,         // seconds played
  "timestamp": Timestamp,
  
  // Optional detailed data
  "details": {
    "correctAnswers": 17,
    "totalQuestions": 20,
    "hintsUsed": 2,
    "difficulty": "easy" | "medium" | "hard"
  }
}
```

**Indexes Required:**
- `userId` (Ascending) + `timestamp` (Descending)
- `kidId` (Ascending) + `timestamp` (Descending)
- `category` (Ascending) + `timestamp` (Descending)

---

### 3. `subscriptions` Collection (Optional - for Stripe webhook sync)

Maintains subscription state synced from Stripe webhooks.

**Document ID:** Stripe Subscription ID

```javascript
{
  "userId": "firebase_auth_uid",
  "customerId": "cus_xxxxx",
  "subscriptionId": "sub_xxxxx",
  "plan": "monthly" | "yearly",
  "status": "active" | "past_due" | "cancelled" | "unpaid",
  "currentPeriodStart": Timestamp,
  "currentPeriodEnd": Timestamp,
  "cancelAtPeriodEnd": false,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection - users can only access their own data
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if false; // Prevent deletion, use soft delete instead
    }
    
    // Game sessions - users can only access their own sessions
    match /game_sessions/{sessionId} {
      allow read: if isSignedIn() && 
                     resource.data.userId == request.auth.uid;
      
      allow create: if isSignedIn() && 
                       request.resource.data.userId == request.auth.uid;
      
      allow update, delete: if false; // Sessions are immutable
    }
    
    // Subscriptions - users can only read their own subscriptions
    // Writes handled by Cloud Functions via Stripe webhooks
    match /subscriptions/{subscriptionId} {
      allow read: if isSignedIn() && 
                     resource.data.userId == request.auth.uid;
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

---

## Indexes

Create these composite indexes in Firebase Console:

### game_sessions
1. Collection: `game_sessions`
   - `userId` Ascending
   - `timestamp` Descending

2. Collection: `game_sessions`
   - `kidId` Ascending
   - `timestamp` Descending

3. Collection: `game_sessions`
   - `category` Ascending
   - `timestamp` Descending

---

## Query Examples

### Get User Profile
```javascript
const userDoc = await db.collection('users').doc(userId).get();
const userData = userDoc.data();
```

### Get All Kid Profiles for a User
```javascript
const userDoc = await db.collection('users').doc(userId).get();
const kids = userDoc.data().kids || [];
```

### Save Game Session
```javascript
await db.collection('game_sessions').add({
  userId: currentUserId,
  kidId: currentKidId,
  gameId: 'balloon-pop',
  gameName: 'Balloon Pop',
  category: 'reading-skills',
  score: 85,
  stars: 3,
  completed: true,
  duration: 120,
  timestamp: firebase.firestore.FieldValue.serverTimestamp()
});
```

### Get Recent Game History
```javascript
const sessions = await db.collection('game_sessions')
  .where('kidId', '==', kidId)
  .orderBy('timestamp', 'desc')
  .limit(20)
  .get();

const history = sessions.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Get Games by Category
```javascript
const sessions = await db.collection('game_sessions')
  .where('userId', '==', userId)
  .where('category', '==', 'reading-skills')
  .orderBy('timestamp', 'desc')
  .limit(10)
  .get();
```

### Update Kid Progress
```javascript
// Get user document
const userRef = db.collection('users').doc(userId);
const userDoc = await userRef.get();
const kids = userDoc.data().kids;

// Find and update kid
const kidIndex = kids.findIndex(k => k.id === kidId);
kids[kidIndex].progress.readingSkills.gamesCompleted++;
kids[kidIndex].progress.readingSkills.stars += 3;

// Save back to Firestore
await userRef.update({ kids });
```

---

## Data Migration

If you need to migrate existing user data:

```javascript
// Batch update for existing users
const batch = db.batch();

const usersSnapshot = await db.collection('users').get();
usersSnapshot.forEach(doc => {
  const userRef = db.collection('users').doc(doc.id);
  batch.update(userRef, {
    'settings.language': 'en',
    'subscription.status': 'free'
  });
});

await batch.commit();
```

---

## Best Practices

1. **Batch Operations**: Use batch writes for multiple updates
2. **Timestamps**: Always use `FieldValue.serverTimestamp()` for accuracy
3. **Array Updates**: Use `arrayUnion` and `arrayRemove` for array modifications
4. **Subcollections vs Arrays**: 
   - Use arrays for kids (limited, frequently accessed together)
   - Use subcollections for game_sessions (unlimited, accessed separately)
5. **Real-time Listeners**: Only use where necessary to save costs
6. **Offline Persistence**: Enable for better mobile experience

---

## Cost Optimization

- **Read Operations**: Most expensive - minimize by caching data
- **Write Operations**: Moderate cost - batch when possible
- **Storage**: Very cheap - not a concern for this app
- **Delete Operations**: Free - but rarely needed

**Estimated Monthly Costs** (1000 active users):
- Reads: ~500K reads/month = $0.18
- Writes: ~100K writes/month = $0.18
- Storage: ~1GB = $0.18
- **Total: ~$0.54/month** (well within free tier)

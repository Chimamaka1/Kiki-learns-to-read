# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., "kiki-learns-to-read")
4. Enable Google Analytics (optional but recommended)
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In Firebase Console, click the **web icon** (</>) to add a web app
2. Enter app nickname (e.g., "Kiki Web App")
3. Check **"Also set up Firebase Hosting"** (for deployment)
4. Click **"Register app"**
5. **Copy the Firebase configuration** - you'll need this!

## Step 3: Enable Authentication

1. In Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable these providers:
   - **Email/Password** - Click, toggle Enable, Save
   - **Google** - Click, toggle Enable, add support email, Save

## Step 4: Set Up Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - Test mode allows read/write access for 30 days
4. Select a Cloud Firestore location (choose closest to your users)
5. Click **"Enable"**

### Production Security Rules (Update Later)

After testing, replace Firestore rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Game sessions - users can only read/write their own sessions
    match /game_sessions/{sessionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 5: Configure Your Project

1. Copy `config.template.js` to `config.js`:
   ```bash
   cp config.template.js config.js
   ```

2. Open `config.js` and replace the Firebase placeholders with your actual values from Step 2:
   ```javascript
   window.config = {
     firebase: {
       apiKey: "AIza...",  // From Firebase Console
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123...",
       measurementId: "G-ABC..." // Optional
     }
   };
   ```

3. **Important**: Add `config.js` to `.gitignore` to keep your credentials private:
   ```
   config.js
   ```

## Step 6: Test Locally

1. Open `index.html` in a web browser
2. Open browser console (F12) - you should see:
   ```
   ✅ Firebase initialized successfully
   No user logged in
   ```
3. Click **"Sign Up"** and create a test account
4. Check Firebase Console > Authentication to see your user

## Step 7: Database Structure

Your Firestore database will automatically create these collections:

### `users` Collection
```
users/{userId}
  ├── email: "user@example.com"
  ├── createdAt: timestamp
  ├── subscription: {
  │     status: "free" | "active" | "cancelled" | "expired"
  │     plan: "free" | "monthly" | "yearly"
  │     startDate: timestamp | null
  │     endDate: timestamp | null
  │   }
  ├── kids: [
  │     {
  │       id: "kid_123456789_abc"
  │       name: "Emma"
  │       age: 3
  │       avatar: "default"
  │       createdAt: timestamp
  │       progress: {
  │         readingSkills: { level: 1, gamesCompleted: 5, stars: 15 }
  │         numbersAndMaths: { level: 2, gamesCompleted: 10, stars: 28 }
  │         logicAndThinking: { level: 1, gamesCompleted: 3, stars: 9 }
  │         creativity: { level: 1, gamesCompleted: 2, stars: 6 }
  │       }
  │       stats: {
  │         totalPlayTime: 3600  // seconds
  │         totalGamesPlayed: 20
  │         favoriteGames: [
  │           { id: "balloon-pop", name: "Balloon Pop", playCount: 8 }
  │         ]
  │       }
  │     }
  │   ]
  └── settings: {
        soundEnabled: true
        musicEnabled: false
        language: "en"
      }
```

### `game_sessions` Collection
```
game_sessions/{sessionId}
  ├── userId: "abc123"
  ├── kidId: "kid_123456789_abc"
  ├── gameId: "balloon-pop"
  ├── gameName: "Balloon Pop"
  ├── category: "reading-skills"
  ├── score: 85
  ├── stars: 3
  ├── completed: true
  ├── duration: 120  // seconds
  └── timestamp: timestamp
```

## Step 8: Deploy to GitHub Pages

1. In Firebase Console, go to **"Hosting"**
2. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

3. Login to Firebase:
   ```bash
   firebase login
   ```

4. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   - Select your project
   - Set public directory to: `.` (current directory)
   - Configure as single-page app: **No**
   - Don't overwrite existing files

5. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

### Alternative: Deploy to GitHub Pages

Since you want to use GitHub Pages, keep using it! Firebase works perfectly with GitHub Pages because:
- Firebase SDK works from any domain
- Authentication works cross-origin
- Firestore has built-in CORS support

Just push your code to GitHub and enable GitHub Pages as usual. Make sure `config.js` is in `.gitignore` and users set up their own Firebase project.

## Step 9: Add Stripe (For Payments)

Coming in next steps! For now, you have:
- ✅ User registration and authentication
- ✅ User profiles and kid profiles
- ✅ Game progress tracking
- ✅ Database structure ready

## Costs & Limits

### Firebase Free Tier (Spark Plan)
- **Authentication**: 10,000 verifications/month
- **Firestore**: 
  - 50,000 reads/day
  - 20,000 writes/day
  - 1 GB storage
- **Hosting**: 10 GB storage, 360 MB/day transfer
- **Perfect for**: Testing and small-scale launch (< 100 daily users)

### Firebase Paid Plan (Blaze - Pay as you go)
- Same free tier included
- Only pay for what you use beyond free limits
- Typical costs for 1,000 daily users: **$25-50/month**

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify Firebase configuration in `config.js`
3. Check Firebase Console > Authentication to see if users are created
4. Check Firebase Console > Firestore to see if data is saved
5. Review Firestore rules if you get permission errors

## Security Notes

⚠️ **Important Security Steps:**
1. Never commit `config.js` to a public repository
2. Update Firestore security rules before going to production
3. Enable App Check in Firebase Console (prevents API abuse)
4. Set up Firebase Authentication email templates (for password resets)
5. Configure authorized domains in Firebase Console > Authentication > Settings

---

**Next Steps:**
- Test authentication flow
- Create kid profiles
- Play games and verify progress is saved
- Review Firebase Console to see data
- Set up Stripe for payments (separate guide coming)

# Firebase Backend - Modular Architecture

Clean, organized backend structure separated from frontend code.

## 📁 Directory Structure

```
firebase/
├── core/
│   └── config.js              # Firebase initialization & configuration
├── services/
│   ├── auth.service.js        # Authentication operations
│   ├── user.service.js        # User profile management
│   ├── kid.service.js         # Kid profile operations
│   ├── progress.service.js    # Game progress tracking
│   └── subscription.service.js # Subscription management
├── utils/
│   ├── storage.js             # Local storage utilities
│   └── helpers.js             # Common helper functions
├── ui/
│   ├── handlers.js            # UI event handlers
│   └── game-integration.js    # Game tracking integration
├── index.js                   # Main entry point
└── README.md                  # This file
```

## 🎯 Module Overview

### Core Module
- **config.js**: Initializes Firebase, manages auth state, provides SDK instances

### Service Modules
- **auth.service.js**: Sign up, sign in, sign out, password reset
- **user.service.js**: User data loading and settings management
- **kid.service.js**: CRUD operations for kid profiles
- **progress.service.js**: Game session tracking and progress updates
- **subscription.service.js**: Subscription status and payment management

### Utility Modules
- **storage.js**: localStorage operations for current kid, settings
- **helpers.js**: UI helpers, formatting, calculations

### UI Modules
- **handlers.js**: Authentication form handlers
- **game-integration.js**: Simplified game tracking API

### Main Entry
- **index.js**: Loads all modules, exposes global API, error handling

## 🔌 Usage

### In HTML Files

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- Firebase Backend Modules -->
<script src="firebase/core/config.js"></script>
<script src="firebase/services/auth.service.js"></script>
<script src="firebase/services/user.service.js"></script>
<script src="firebase/services/kid.service.js"></script>
<script src="firebase/services/progress.service.js"></script>
<script src="firebase/services/subscription.service.js"></script>
<script src="firebase/utils/storage.js"></script>
<script src="firebase/utils/helpers.js"></script>
<script src="firebase/index.js"></script>
<script src="firebase/ui/handlers.js"></script>
<script src="firebase/ui/game-integration.js"></script>
```

### In JavaScript

#### Authentication
```javascript
// Sign up
const result = await AuthService.signUp('email@example.com', 'password', 'Name');

// Sign in
const result = await AuthService.signIn('email@example.com', 'password');

// Sign in with Google
const result = await AuthService.signInWithGoogle();

// Sign out
await AuthService.signOut();

// Check if logged in
if (AuthService.isLoggedIn()) {
  // User is authenticated
}
```

#### Kid Profiles
```javascript
// Add kid profile
const result = await KidService.addKidProfile({
  name: 'Emma',
  age: 3,
  avatar: 'default'
});

// Get all kids
const result = await KidService.getKidProfiles();

// Set current kid
StorageUtil.setCurrentKid(kidId);

// Get current kid
const kidId = StorageUtil.getCurrentKid();
```

#### Game Progress Tracking
```javascript
// Initialize game
GameIntegration.initializeGame({
  gameId: 'balloon-pop',
  gameName: 'Balloon Pop',
  category: 'reading-skills'
});

// When game ends
GameIntegration.endGame(score, stars, completed);

// Or use simplified functions
initializeGame({ gameId, gameName, category });
endGame(score, stars, completed);
```

#### Progress Queries
```javascript
// Get game history
const result = await ProgressService.getGameHistory(kidId, 20);

// Get progress summary
const summary = await ProgressService.getProgressSummary(kidId);
```

#### Subscriptions
```javascript
// Check subscription
const isActive = await SubscriptionService.hasActiveSubscription();

// Update subscription
await SubscriptionService.updateSubscription({
  status: 'active',
  plan: 'monthly',
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
});
```

## 🌐 Global API

All services are also available via `window.Firebase`:

```javascript
window.Firebase.Auth.signIn(email, password);
window.Firebase.Kid.addKidProfile(data);
window.Firebase.Progress.saveGameProgress(kidId, gameData);
window.Firebase.Helpers.showMessage('Success!', 'success');
```

## 📋 Configuration

Create `config.js` in root directory (copy from `config.template.js`):

```javascript
window.config = {
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

## 🎨 Benefits of This Structure

✅ **Separation of Concerns**: Backend logic isolated from frontend  
✅ **Modular**: Each service is independent and testable  
✅ **Maintainable**: Easy to find and update specific functionality  
✅ **Scalable**: Add new services without affecting existing code  
✅ **Clean**: No global namespace pollution  
✅ **Documented**: Each module has clear purpose and API  

## 🔄 Migration from Old Structure

Old files (now deprecated):
- ~~firebase-config.js~~ → `firebase/core/config.js`
- ~~auth.js~~ → `firebase/services/auth.service.js`
- ~~database.js~~ → Split into multiple service files
- ~~game-integration.js~~ → `firebase/ui/game-integration.js`

Update your HTML to use new script paths as shown above.

## 📦 Dependencies

- Firebase SDK 9.22.0 (compat mode)
- Modern browser with ES6 support
- No build tools required

## 🐛 Debugging

```javascript
// Check if Firebase is initialized
if (FirebaseConfig.isReady()) {
  console.log('Firebase ready');
}

// Access SDK instances
const auth = FirebaseConfig.getAuth();
const db = FirebaseConfig.getFirestore();

// Listen to events
window.addEventListener('userLoggedIn', (e) => {
  console.log('User:', e.detail.user);
});

window.addEventListener('userLoggedOut', () => {
  console.log('User signed out');
});
```

## 📝 License

Part of Kiki Learns to Read educational application.

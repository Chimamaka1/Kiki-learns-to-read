# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  index.html  │  │    Games     │  │     CSS      │          │
│  │              │  │  (Multiple)  │  │   Styling    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘          │
│         │                 │                                      │
└─────────┼─────────────────┼──────────────────────────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE BACKEND LAYER                        │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    firebase/index.js                        │ │
│  │              (Main Entry Point & Global API)                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌──────────────────────┐  ┌───────────────────────────────┐   │
│  │    CORE MODULE       │  │      UI COMPONENTS            │   │
│  ├──────────────────────┤  ├───────────────────────────────┤   │
│  │  firebase/core/      │  │  firebase/ui/                 │   │
│  │  • config.js         │  │  • handlers.js                │   │
│  │    - Initialize      │  │    - Form handlers            │   │
│  │    - Auth observer   │  │    - Event listeners          │   │
│  │    - SDK access      │  │  • game-integration.js        │   │
│  └──────────────────────┘  │    - Game tracking            │   │
│                             │    - Progress notifications   │   │
│  ┌──────────────────────┐  └───────────────────────────────┘   │
│  │   SERVICE LAYER      │                                       │
│  ├──────────────────────┤  ┌───────────────────────────────┐   │
│  │  firebase/services/  │  │     UTILITIES                 │   │
│  │  • auth.service.js   │  ├───────────────────────────────┤   │
│  │  • user.service.js   │  │  firebase/utils/              │   │
│  │  • kid.service.js    │  │  • storage.js                 │   │
│  │  • progress.service  │  │    - localStorage ops         │   │
│  │  • subscription      │  │  • helpers.js                 │   │
│  └──────────────────────┘  │    - UI helpers               │   │
│                             │    - Formatters               │   │
│                             └───────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE CLOUD                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Authentication│  │  Firestore   │  │  Analytics   │          │
│  │   - Email     │  │  Database    │  │   (Optional) │          │
│  │   - Google    │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Module Dependencies

```
                    ┌─────────────────┐
                    │  Firebase SDK   │
                    │   (External)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ firebase/core/  │
                    │   config.js     │
                    └────┬────┬───┬───┘
                         │    │   │
        ┌────────────────┤    │   └──────────────────┐
        │                │    │                       │
        ▼                ▼    ▼                       ▼
┌───────────────┐  ┌─────────────────┐  ┌────────────────────┐
│ Services      │  │ Utils           │  │ UI                 │
├───────────────┤  ├─────────────────┤  ├────────────────────┤
│ auth.service  │  │ storage.js      │  │ handlers.js        │
│ user.service  │  │ helpers.js      │  │ game-integration   │
│ kid.service   │  └─────────────────┘  └────────────────────┘
│ progress      │
│ subscription  │
└───────────────┘
        │
        └──────────────┐
                       ▼
              ┌────────────────┐
              │ firebase/      │
              │  index.js      │
              │ (Global API)   │
              └────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  Application   │
              │   Frontend     │
              └────────────────┘
```

## Data Flow

### Authentication Flow
```
User Action (Form Submit)
    │
    ▼
firebase/ui/handlers.js
    │
    ▼
firebase/services/auth.service.js
    │
    ▼
firebase/core/config.js (Auth SDK)
    │
    ▼
Firebase Authentication
    │
    ▼
Auth State Changed Event
    │
    ▼
firebase/core/config.js (Observer)
    │
    ├──▶ Update UI
    ├──▶ Load User Data
    └──▶ Dispatch Events
```

### Game Progress Flow
```
Game Ends
    │
    ▼
firebase/ui/game-integration.js
  (GameIntegration.endGame())
    │
    ▼
firebase/services/progress.service.js
  (ProgressService.saveGameProgress())
    │
    ├──▶ Save to game_sessions collection
    │
    └──▶ Update kid's progress
         │
         ▼
    firebase/services/kid.service.js
      (Update progress stats)
         │
         ▼
    Firestore Database
```

### Kid Selection Flow
```
User Opens Game
    │
    ▼
Check if Logged In
    │
    ├──▶ No: Play as Guest
    │
    └──▶ Yes: Get Current Kid
              │
              ├──▶ Has Kid: Use kid profile
              │
              └──▶ No Kid: Show Kid Selector
                           │
                           ▼
                   firebase/ui/game-integration.js
                     (showKidSelector())
                           │
                           ▼
                   firebase/services/kid.service.js
                     (getKidProfiles())
                           │
                           ▼
                   Display Kid Options
                           │
                           ▼
                   firebase/utils/storage.js
                     (setCurrentKid())
```

## Module Responsibilities

### Core Layer
**firebase/core/config.js**
- Initialize Firebase SDK
- Manage auth state
- Provide SDK instances
- Handle global errors

### Service Layer
**firebase/services/auth.service.js**
- Sign up / Sign in / Sign out
- Password reset
- Google authentication

**firebase/services/user.service.js**
- Load user data
- Update settings
- Manage user profile

**firebase/services/kid.service.js**
- CRUD operations for kids
- Kid profile management

**firebase/services/progress.service.js**
- Save game sessions
- Track progress
- Get game history

**firebase/services/subscription.service.js**
- Subscription management
- Payment status
- Plan updates

### Utility Layer
**firebase/utils/storage.js**
- localStorage operations
- Current kid management
- Settings persistence

**firebase/utils/helpers.js**
- UI notifications
- Modal management
- Data formatting
- Common utilities

### UI Layer
**firebase/ui/handlers.js**
- Form event handlers
- Button click handlers
- Modal interactions

**firebase/ui/game-integration.js**
- Game initialization
- Progress tracking
- Kid selector UI
- Victory celebrations

## Communication Patterns

### Service to Service
```javascript
// Services can call other services
ProgressService.saveGameProgress(kidId, gameData)
  └──▶ KidService.updateKidProfile(kidId, updates)
```

### Event-Based Communication
```javascript
// Core emits events
window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { user } }));

// UI listens to events
window.addEventListener('userLoggedIn', (e) => {
  updateDashboard(e.detail.user);
});
```

### Callback Pattern
```javascript
// Async service calls
const result = await AuthService.signIn(email, password);
if (result.success) {
  // Handle success
} else {
  // Handle error
}
```

## File Size Distribution

```
Services (48%)  ████████████████████████
Utils (9%)      █████
UI (27%)        █████████████
Core (9%)       █████
Main (7%)       ████
```

## Code Complexity

```
Low Complexity:
  - firebase/utils/storage.js
  - firebase/utils/helpers.js
  - firebase/index.js

Medium Complexity:
  - firebase/services/auth.service.js
  - firebase/services/user.service.js
  - firebase/services/subscription.service.js
  - firebase/ui/handlers.js

Higher Complexity:
  - firebase/core/config.js
  - firebase/services/kid.service.js
  - firebase/services/progress.service.js
  - firebase/ui/game-integration.js
```

## Testability Score

```
Module                          Testability
─────────────────────────────────────────
firebase/core/config.js              ★★★☆☆
firebase/services/auth.service       ★★★★★
firebase/services/user.service       ★★★★★
firebase/services/kid.service        ★★★★★
firebase/services/progress.service   ★★★★★
firebase/services/subscription       ★★★★★
firebase/utils/storage.js            ★★★★★
firebase/utils/helpers.js            ★★★★★
firebase/ui/handlers.js              ★★★☆☆
firebase/ui/game-integration.js      ★★★☆☆
```

## Summary

✅ **Clean Architecture**
- Modular design
- Clear separation of concerns
- Single responsibility per module

✅ **Maintainable**
- Easy to locate code
- Simple to update features
- Clear dependencies

✅ **Scalable**
- Add new services easily
- Extend without breaking
- Independent modules

✅ **Professional**
- Industry standards
- Well documented
- Production ready

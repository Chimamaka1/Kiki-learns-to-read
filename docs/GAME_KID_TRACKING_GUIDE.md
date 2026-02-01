# Game Kid Tracking Integration Guide

## Overview

The profile system now tracks which kid is playing games and can link game progress to specific children. This document explains how games should integrate with this system.

## How It Works

### 1. **Parent Sets Kid Before Playing**
- Parent selects a kid from the dropdown in the top-right corner of the home page
- Selection is saved to localStorage as `selectedKidId`
- This persists across page reloads

### 2. **Games Access Current Kid**
Games can get the currently selected kid ID by calling:

```javascript
const kidId = getCurrentKid(); // Returns kid ID from localStorage
```

Or use the newer function in script.js:
```javascript
const kidId = getCurrentSelectedKidId(); // Returns currentSelectedKidId variable
```

### 3. **Track Game Progress**
Use the `game-integration.js` functions to track game completion:

```javascript
// At game start
initializeGame({
  gameId: 'balloon-pop',
  gameName: 'Balloon Pop',
  category: 'reading-skills'
});

// When game ends
const finalScore = 85;
const stars = 3; // Based on score
endGame(finalScore, stars, true);
```

## Implementation Steps

### Step 1: Initialize Game
Add this at the beginning of your game file (in the window.onload or init function):

```javascript
function initGame() {
  // Initialize game tracking with kid
  initializeGame({
    gameId: 'your-game-id',           // e.g., 'balloon-pop'
    gameName: 'Your Game Name',       // e.g., 'Balloon Pop'
    category: 'reading-skills'        // 'reading-skills', 'numbers-and-maths', 'logic', 'creativity'
  });

  // Check if a kid is selected
  const kidId = getCurrentKid();
  if (!kidId) {
    console.warn('No kid selected - progress will not be saved');
  } else {
    console.log(`Playing as kid: ${kidId}`);
  }
  
  // Rest of game initialization...
}
```

### Step 2: Track Game Completion
When the game ends, call `endGame()`:

```javascript
function gameOver(finalScore) {
  // Calculate stars based on score
  const stars = calculateStars(finalScore);
  
  // Save progress
  endGame(finalScore, stars, true);
  
  // Show results...
}

function calculateStars(score) {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}
```

### Step 3: Optional - Show Kid Name During Game
Display the selected kid's name during gameplay:

```javascript
async function displayKidName() {
  const kidId = getCurrentKid();
  if (!kidId) return;
  
  // Get kid data from parent's userData
  if (window.userData && window.userData.kids) {
    const kid = window.userData.kids.find(k => k.id === kidId);
    if (kid) {
      console.log(`Playing as: ${kid.name}`);
      // Display on screen...
    }
  }
}
```

## Available Functions

### From `script.js`:
- `populateKidSelector()` - Populates the kid dropdown with available kids
- `selectKidForGame()` - Called when user changes kid selection
- `getCurrentSelectedKidId()` - Returns currently selected kid ID from variable
- `initializeKidSelector()` - Initializes the selector on page load

### From `game-integration.js`:
- `initializeGame(config)` - Initialize game with kid tracking
- `endGame(score, stars, completed)` - Save game progress
- `isLoggedIn()` - Check if user is logged in
- `getCurrentKid()` - Get current kid ID from localStorage
- `setCurrentKid(kidId)` - Set current kid ID in localStorage
- `selectKid(kidId)` - Select a kid and update UI

## Database Updates

When `endGame()` is called, it updates the kid's profile in Firestore:

```javascript
{
  progress: {
    [category]: {
      level: number,           // Current level
      gamesCompleted: number,  // Incremented with each game
      stars: number           // Total stars earned
    }
  },
  stats: {
    totalPlayTime: number,      // Added to
    totalGamesPlayed: number,   // Incremented
    favoriteGames: [...]        // Updated
  }
}
```

## Example Implementation

Here's a complete example for the Balloon Pop game:

```javascript
// balloon.js

let gameActive = true;
let score = 0;
let currentKidId = null;

function init() {
  // Get current kid and initialize tracking
  currentKidId = getCurrentKid();
  
  initializeGame({
    gameId: 'balloon-pop',
    gameName: 'Balloon Pop',
    category: 'reading-skills'
  });
  
  if (!currentKidId) {
    console.warn('No kid profile selected');
  }
  
  startGame();
}

function onBalloonPopped() {
  score += 10;
  // Game logic...
}

function endGameRound() {
  gameActive = false;
  
  // Calculate performance
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;
  
  // Save progress
  endGame(score, stars, true);
  
  // Show results
  showGameOver();
}

// Initialize on load
window.onload = init;
```

## Testing

To test the integration:

1. **Sign in** to parent account
2. **Add a kid** from the profile page
3. **Go back to home** page
4. **Select the kid** from the dropdown
5. **Start a game**
6. **Check browser console** - should see game initialization messages
7. **Complete game** and check Firestore to see progress updated

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Kid selector not showing | Ensure kids are added to profile and page is reloaded after profile save |
| Progress not saving | Check that kid ID is selected before starting game |
| "No kid selected" warning | Parent must select a kid from dropdown before game starts |
| Firestore not updating | Verify kid progress structure exists in database |

## Categories

Use these category names in `initializeGame()`:

- `reading-skills` - Reading/literacy games
- `numbers-and-maths` - Math and number games  
- `logic` - Logic and thinking games
- `creativity` - Creative games

## Progress Calculation

Progress is tracked by category:

```javascript
progress: {
  readingSkills: {
    level: 1,           // Increases based on games completed
    gamesCompleted: 0,  // Incremented each game
    stars: 0           // Total stars from all attempts
  },
  numbersAndMaths: { ... },
  logicAndThinking: { ... },
  creativity: { ... }
}
```

The profile page displays this data to show parents how their child is progressing in each learning area.

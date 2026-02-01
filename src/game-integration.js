// Game Integration Helper
// Add this to your game files to track progress

// Call this when a game loads
function initializeGame(gameConfig) {
  const gameId = gameConfig.gameId;        // e.g., 'balloon-pop'
  const gameName = gameConfig.gameName;    // e.g., 'Balloon Pop'
  const category = gameConfig.category;    // e.g., 'reading-skills'
  
  window.currentGame = {
    id: gameId,
    name: gameName,
    category: category,
    startTime: Date.now(),
    score: 0,
    completed: false
  };
  
  // Check if user is logged in
  if (!isLoggedIn()) {
    console.log("Playing as guest - progress won't be saved");
    return;
  }
  
  // Get current active kid
  const kidId = getCurrentKid();
  if (!kidId) {
    console.log("No kid profile selected - progress won't be saved");
    return;
  }
  
  console.log(`Game initialized: ${gameName} for kid ${kidId}`);
}

// Call this when game ends
async function endGame(finalScore, stars, completed = true) {
  if (!window.currentGame) {
    console.error("Game not initialized - call initializeGame() first");
    return;
  }
  
  const duration = Math.floor((Date.now() - window.currentGame.startTime) / 1000);
  
  window.currentGame.score = finalScore;
  window.currentGame.completed = completed;
  window.currentGame.duration = duration;
  
  // Save progress if user is logged in
  if (isLoggedIn()) {
    const kidId = getCurrentKid();
    if (kidId) {
      const gameData = {
        gameId: window.currentGame.id,
        gameName: window.currentGame.name,
        category: window.currentGame.category,
        score: finalScore,
        stars: stars,
        completed: completed,
        duration: duration
      };
      
      const result = await saveGameProgress(kidId, gameData);
      
      if (result.success) {
        console.log("✅ Game progress saved!");
        showProgressNotification(stars, finalScore);
      } else {
        console.error("❌ Failed to save progress:", result.error);
      }
    }
  }
  
  // Show results
  showGameResults(finalScore, stars, duration);
}

// Show progress notification
function showProgressNotification(stars, score) {
  const notification = document.createElement('div');
  notification.className = 'progress-notification';
  notification.innerHTML = `
    <div class="progress-card">
      <div class="stars">${'⭐'.repeat(stars)}</div>
      <div class="score">Score: ${score}</div>
      <div class="message">Progress Saved!</div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Show game results
function showGameResults(score, stars, duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  
  // You can customize this based on your UI
  console.log(`
    🎮 Game Complete!
    ⭐ Stars: ${stars}/3
    📊 Score: ${score}
    ⏱️ Time: ${minutes}:${seconds.toString().padStart(2, '0')}
  `);
  
  // Trigger confetti or celebration animation if 3 stars
  if (stars === 3) {
    celebrateVictory();
  }
}

// Celebration animation
function celebrateVictory() {
  // Simple confetti effect
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
  
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}%;
        top: -10px;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation: fall 3s linear forwards;
        z-index: 9999;
      `;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }, i * 50);
  }
}

// Add confetti animation to page
if (!document.getElementById('confetti-style')) {
  const style = document.createElement('style');
  style.id = 'confetti-style';
  style.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
    
    .progress-notification {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      animation: slideIn 0.5s ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translate(-50%, -100%);
        opacity: 0;
      }
      to {
        transform: translate(-50%, -50%);
        opacity: 1;
      }
    }
    
    .progress-card {
      background: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      text-align: center;
      min-width: 200px;
    }
    
    .progress-card .stars {
      font-size: 48px;
      margin-bottom: 10px;
    }
    
    .progress-card .score {
      font-size: 24px;
      font-weight: bold;
      color: #4CAF50;
      margin-bottom: 10px;
    }
    
    .progress-card .message {
      font-size: 16px;
      color: #666;
    }
  `;
  document.head.appendChild(style);
}

// =========================================
// EXAMPLE USAGE IN YOUR GAME FILES
// =========================================

/*

// At the start of your game (e.g., in window.onload or init function)
initializeGame({
  gameId: 'balloon-pop',
  gameName: 'Balloon Pop',
  category: 'reading-skills'
});

// When game ends
let finalScore = 85;
let stars = 3; // Calculate based on score
let completed = true;

endGame(finalScore, stars, completed);

// Stars calculation example
function calculateStars(score) {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}

*/

// =========================================
// KID PROFILE SELECTOR
// =========================================

// Show kid selector modal before game starts
function showKidSelector() {
  if (!isLoggedIn()) {
    // User not logged in - proceed as guest
    return true;
  }
  
  getKidProfiles().then(result => {
    if (result.success && result.kids.length > 0) {
      // Show kid selector
      displayKidSelector(result.kids);
    } else {
      // No kids yet - prompt to create one
      promptCreateKid();
    }
  });
}

// Display kid selector UI
function displayKidSelector(kids) {
  const currentKidId = getCurrentKid();
  
  const modal = document.createElement('div');
  modal.id = 'kid-selector-modal';
  modal.className = 'modal';
  modal.style.display = 'flex';
  
  let kidsHTML = kids.map(kid => `
    <div class="kid-option ${kid.id === currentKidId ? 'selected' : ''}" 
         onclick="selectKid('${kid.id}')">
      <div class="kid-avatar">${kid.avatar === 'default' ? '👶' : kid.avatar}</div>
      <div class="kid-name">${kid.name}</div>
      <div class="kid-level">Level ${Math.max(...Object.values(kid.progress).map(p => p.level))}</div>
    </div>
  `).join('');
  
  modal.innerHTML = `
    <div class="modal-content">
      <h2>👨‍👩‍👧‍👦 Who's Playing?</h2>
      <div class="kids-grid">
        ${kidsHTML}
      </div>
      <button onclick="closeKidSelector()" class="auth-button">
        Continue
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Select kid and close modal
function selectKid(kidId) {
  setCurrentKid(kidId);
  
  // Update UI
  const options = document.querySelectorAll('.kid-option');
  options.forEach(opt => opt.classList.remove('selected'));
  event.target.closest('.kid-option').classList.add('selected');
}

// Close kid selector
function closeKidSelector() {
  const modal = document.getElementById('kid-selector-modal');
  if (modal) modal.remove();
}

// Prompt to create first kid
function promptCreateKid() {
  if (confirm("Let's create a profile for your child! Click OK to continue.")) {
    // Show create kid form (implement based on your UI)
    showCreateKidForm();
  }
}

// Example: Create kid form
function showCreateKidForm() {
  const name = prompt("What's your child's name?");
  if (!name) return;
  
  const age = prompt("How old is your child? (2-4)");
  if (!age) return;
  
  addKidProfile({
    name: name,
    age: parseInt(age),
    avatar: 'default'
  }).then(result => {
    if (result.success) {
      alert(`Welcome ${name}! Let's start playing!`);
      setCurrentKid(result.kid.id);
    }
  });
}

// =========================================
// HELPER FUNCTIONS
// =========================================

// Check if user is logged in
function isLoggedIn() {
  return !!auth.currentUser;
}

// Get currently selected kid ID from localStorage
function getCurrentKid() {
  return localStorage.getItem('selectedKidId');
}

// Set currently selected kid ID in localStorage
function setCurrentKid(kidId) {
  localStorage.setItem('selectedKidId', kidId);
  currentSelectedKidId = kidId;
}

// Select a kid and update selector
function selectKid(kidId) {
  setCurrentKid(kidId);
  const selector = document.getElementById('kid-selector');
  if (selector) {
    selector.value = kidId;
  }
  closeKidSelector();
}

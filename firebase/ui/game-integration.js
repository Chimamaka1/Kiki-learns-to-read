/**
 * Game Integration Module
 * Simplifies game progress tracking
 * 
 * @module firebase/ui/game-integration
 */

const GameIntegration = (function() {
  'use strict';

  let currentGame = null;

  /**
   * Initialize game tracking
   * @param {Object} gameConfig - Game configuration
   * @param {string} gameConfig.gameId - Unique game identifier
   * @param {string} gameConfig.gameName - Display name
   * @param {string} gameConfig.category - Game category
   */
  function initializeGame(gameConfig) {
    currentGame = {
      id: gameConfig.gameId,
      name: gameConfig.gameName,
      category: gameConfig.category,
      startTime: Date.now(),
      score: 0,
      completed: false
    };
    
    if (!AuthService.isLoggedIn()) {
      console.log('Playing as guest - progress won\'t be saved');
      return;
    }
    
    const kidId = StorageUtil.getCurrentKid();
    if (!kidId) {
      console.log('No kid profile selected');
      showKidSelector();
    } else {
      console.log(`Game initialized: ${gameConfig.gameName} for kid ${kidId}`);
    }
  }

  /**
   * End game and save progress
   * @param {number} finalScore - Final game score
   * @param {number} stars - Stars earned (0-3)
   * @param {boolean} completed - Whether game was completed
   */
  async function endGame(finalScore, stars, completed = true) {
    if (!currentGame) {
      console.error('Game not initialized - call initializeGame() first');
      return;
    }
    
    const duration = Math.floor((Date.now() - currentGame.startTime) / 1000);
    
    currentGame.score = finalScore;
    currentGame.completed = completed;
    currentGame.duration = duration;
    
    // Save progress if logged in
    if (AuthService.isLoggedIn()) {
      const kidId = StorageUtil.getCurrentKid();
      if (kidId) {
        const gameData = {
          gameId: currentGame.id,
          gameName: currentGame.name,
          category: currentGame.category,
          score: finalScore,
          stars: stars,
          completed: completed,
          duration: duration
        };
        
        const result = await ProgressService.saveGameProgress(kidId, gameData);
        
        if (result.success) {
          console.log('✅ Game progress saved!');
          showProgressNotification(stars, finalScore);
        } else {
          console.error('❌ Failed to save progress:', result.error);
        }
      }
    }
    
    showGameResults(finalScore, stars, duration);
  }

  /**
   * Show progress notification
   * @private
   */
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
    
    setTimeout(() => notification.remove(), 3000);
  }

  /**
   * Show game results
   * @private
   */
  function showGameResults(score, stars, duration) {
    const timeStr = FirebaseHelpers.formatDuration(duration);
    
    console.log(`
      🎮 Game Complete!
      ⭐ Stars: ${stars}/3
      📊 Score: ${score}
      ⏱️ Time: ${timeStr}
    `);
    
    if (stars === 3) {
      celebrateVictory();
    }
  }

  /**
   * Celebration animation
   * @private
   */
  function celebrateVictory() {
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

  /**
   * Show kid selector
   * @private
   */
  async function showKidSelector() {
    const result = await KidService.getKidProfiles();
    
    if (result.success && result.kids.length > 0) {
      displayKidSelector(result.kids);
    } else {
      promptCreateKid();
    }
  }

  /**
   * Display kid selector modal
   * @private
   */
  function displayKidSelector(kids) {
    const currentKidId = StorageUtil.getCurrentKid();
    
    const modal = document.createElement('div');
    modal.id = 'kid-selector-modal';
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    const kidsHTML = kids.map(kid => `
      <div class="kid-option ${kid.id === currentKidId ? 'selected' : ''}" 
           data-kid-id="${kid.id}">
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
        <button id="continue-kid-selector" class="auth-button">
          Continue
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add click handlers
    modal.querySelectorAll('.kid-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const kidId = opt.getAttribute('data-kid-id');
        StorageUtil.setCurrentKid(kidId);
        modal.querySelectorAll('.kid-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
    
    document.getElementById('continue-kid-selector').addEventListener('click', () => {
      modal.remove();
    });
  }

  /**
   * Prompt to create first kid
   * @private
   */
  function promptCreateKid() {
    if (confirm("Let's create a profile for your child! Click OK to continue.")) {
      const name = prompt("What's your child's name?");
      if (!name) return;
      
      const age = prompt("How old is your child? (2-4)");
      if (!age) return;
      
      KidService.addKidProfile({
        name: name,
        age: parseInt(age),
        avatar: 'default'
      }).then(result => {
        if (result.success) {
          alert(`Welcome ${name}! Let's start playing!`);
          StorageUtil.setCurrentKid(result.kid.id);
        }
      });
    }
  }

  // Add required CSS
  if (!document.getElementById('game-integration-style')) {
    const style = document.createElement('style');
    style.id = 'game-integration-style';
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
      
      .kids-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
        margin: 20px 0;
      }
      
      .kid-option {
        padding: 15px;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .kid-option:hover {
        border-color: #4CAF50;
        transform: translateY(-2px);
      }
      
      .kid-option.selected {
        border-color: #4CAF50;
        background: #f1f8f4;
      }
      
      .kid-avatar {
        font-size: 48px;
        margin-bottom: 8px;
      }
      
      .kid-name {
        font-weight: bold;
        color: #333;
        margin-bottom: 4px;
      }
      
      .kid-level {
        font-size: 12px;
        color: #666;
      }
    `;
    document.head.appendChild(style);
  }

  // Public API
  return {
    initializeGame,
    endGame,
    showKidSelector
  };
})();

// Backward compatibility
window.initializeGame = GameIntegration.initializeGame;
window.endGame = GameIntegration.endGame;
window.getCurrentKid = StorageUtil.getCurrentKid;
window.setCurrentKid = StorageUtil.setCurrentKid;

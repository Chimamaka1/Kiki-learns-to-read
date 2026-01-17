// Number Balloon Pop Game Logic
let currentNumberToFind = 0;
let balloonScore = 0;
let balloonLevel = 1;

// Balloon colors
const balloonColors = ['balloon-red', 'balloon-blue', 'balloon-yellow', 'balloon-green', 'balloon-purple', 'balloon-pink', 'balloon-orange', 'balloon-cyan'];

// Local speech helper so this game does not depend on the main script
const speechReady = typeof window !== 'undefined' && 'speechSynthesis' in window;
if (typeof speakText !== 'function') {
  function speakText(text) {
    if (!speechReady) return;
    try {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(String(text)));
    } catch (e) {
      // Swallow speech errors to avoid breaking the UI
    }
  }
}

// Navigation function
function goBack() {
  window.history.back();
}

function generateBalloonQuestion() {
  // Generate a number between 1 and Math.min(50, level * 10)
  const maxNumber = Math.min(50, balloonLevel * 10);
  currentNumberToFind = Math.floor(Math.random() * maxNumber) + 1;
  
  // Update instructions
  const instructionElement = document.getElementById('number-to-pop');
  if (instructionElement) {
    instructionElement.textContent = `Pop the balloon with ${currentNumberToFind}!`;
  }
  
  // Speak the number after a small delay to ensure audio gate is ready
  setTimeout(() => {
    try {
      if (typeof speakText === 'function') speakText(currentNumberToFind);
    } catch (e) {
      // ignore speech errors
    }
  }, 100);
  
  // Display balloons
  try {
    generateBalloonGrid();
  } catch (e) {
    const balloonGrid = document.getElementById('balloons-grid');
    if (balloonGrid) {
      balloonGrid.innerHTML = '<p style="color:#dc3545;font-weight:700;">Balloons failed to load. Please reload.</p>';
    }
  }
}

function generateBalloonGrid() {
  const balloonGrid = document.getElementById('balloons-grid');
  if (!balloonGrid) return;
  
  balloonGrid.innerHTML = '';
  
  // Generate 12 balloons with random numbers, one being the correct answer
  const balloons = new Set();
  balloons.add(currentNumberToFind);
  
  const maxNumber = Math.min(50, balloonLevel * 10);
  while (balloons.size < 12) {
    const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    balloons.add(randomNumber);
  }
  
  // Shuffle balloons
  const balloonsArray = Array.from(balloons).sort(() => Math.random() - 0.5);
  
  // Create balloon elements
  balloonsArray.forEach((number, index) => {
    const balloonDiv = document.createElement('div');
    balloonDiv.className = 'balloon';
    balloonDiv.style.animation = `fadeIn 0.3s ease-in-out ${index * 0.05}s both`;
    
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    
    const balloonBody = document.createElement('div');
    balloonBody.className = `balloon-body ${color}`;
    balloonBody.textContent = number;
    balloonBody.addEventListener('click', () => checkBalloonAnswer(number, balloonDiv));
    
    const balloonString = document.createElement('div');
    balloonString.className = 'balloon-string';
    
    balloonDiv.appendChild(balloonBody);
    balloonDiv.appendChild(balloonString);
    balloonGrid.appendChild(balloonDiv);
  });

  // Fallback: if for some reason no balloons rendered, show a basic set
  if (!balloonGrid.children.length) {
    const fallbackList = Array.from({ length: 8 }, (_, i) => i + 1);
    fallbackList.forEach(n => {
      const btn = document.createElement('button');
      btn.textContent = n;
      btn.style.margin = '8px';
      btn.style.padding = '14px 18px';
      btn.style.fontSize = '18px';
      btn.style.border = '2px solid #007bff';
      btn.style.borderRadius = '12px';
      btn.style.background = '#fff';
      btn.onclick = () => checkBalloonAnswer(n, btn);
      balloonGrid.appendChild(btn);
    });
  }
}

function checkBalloonAnswer(selectedNumber, balloonElement) {
  const isCorrect = selectedNumber === currentNumberToFind;
  
  // Disable all balloons temporarily
  const allBalloons = document.querySelectorAll('.balloon-body');
  allBalloons.forEach(balloon => balloon.style.pointerEvents = 'none');
  
  if (isCorrect) {
    // Pop animation
    balloonElement.classList.add('balloon-popped');
    balloonElement.classList.add('burst');
    
    balloonScore += 10;
    
    // Update score display
    const scoreElement = document.getElementById('balloon-score');
    if (scoreElement) scoreElement.textContent = balloonScore;
    
    // Level up every 50 points
    if (balloonScore % 50 === 0) {
      balloonLevel++;
      const levelElement = document.getElementById('balloon-level');
      if (levelElement) levelElement.textContent = balloonLevel;
    }
    
    // Say "Correct!" or similar
    if (typeof speakText === 'function') {
      speakText(`Correct! That is ${currentNumberToFind}!`);
    }
    
    // Generate new question after a short delay
    setTimeout(() => {
      generateBalloonQuestion();
      // Re-enable balloons
      const newBalloons = document.querySelectorAll('.balloon-body');
      newBalloons.forEach(balloon => balloon.style.pointerEvents = 'auto');
    }, 500);
  } else {
    // Wrong balloon - shake effect
    balloonElement.parentElement.style.animation = 'shake 0.3s ease-in-out';
    if (typeof speakText === 'function') {
      speakText(`Not quite! Try again. Find ${currentNumberToFind}.`);
    }
    
    // Reset animation
    setTimeout(() => {
      balloonElement.parentElement.style.animation = '';
      allBalloons.forEach(balloon => balloon.style.pointerEvents = 'auto');
    }, 300);
  }
}

function speakNumber() {
  if (typeof speakText === 'function') {
    speakText(currentNumberToFind);
  }
}

// Save progress to localStorage
function saveBalloonProgress() {
  try {
    const progressData = {
      score: balloonScore,
      level: balloonLevel,
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem('balloonGameProgress', JSON.stringify(progressData));
  } catch (e) {
    // If storage is unavailable (private mode / file protocol), skip silently
  }
}

// Load progress from localStorage
function loadBalloonProgress() {
  try {
    const saved = localStorage.getItem('balloonGameProgress');
    if (saved) {
      const progressData = JSON.parse(saved);
      balloonScore = progressData.score || 0;
      balloonLevel = progressData.level || 1;
      
      // Update display
      const scoreElement = document.getElementById('balloon-score');
      const levelElement = document.getElementById('balloon-level');
      if (scoreElement) scoreElement.textContent = balloonScore;
      if (levelElement) levelElement.textContent = balloonLevel;
    }
  } catch (e) {
    // Ignore storage errors and continue with defaults
  }
}

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Load saved progress (guarded)
    loadBalloonProgress();
  } catch (e) {
    console.warn('Progress load failed', e);
  }
  
  try {
    const speakNumberBtn = document.getElementById('speak-number-btn');
    if (speakNumberBtn) {
      speakNumberBtn.addEventListener('click', speakNumber);
    }
  } catch (e) {
    console.warn('Listener setup failed', e);
  }
  
  try {
    generateBalloonQuestion();
  } catch (e) {
    const balloonGrid = document.getElementById('balloons-grid');
    if (balloonGrid) {
      balloonGrid.innerHTML = '<p style="color:#dc3545;font-weight:700;">Could not start game. Reload the page.</p>';
    }
    console.error('Balloon init failed', e);
  }
  
  // Save progress periodically
  setInterval(() => {
    try { saveBalloonProgress(); } catch (e) { /* ignore */ }
  }, 5000);
});

// Save progress when leaving the page
window.addEventListener('beforeunload', saveBalloonProgress);

// Add shake animation if not already defined
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);

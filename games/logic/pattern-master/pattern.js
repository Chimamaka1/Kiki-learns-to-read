/* =========================
   PATTERN MASTER - GAME LOGIC
========================= */

// Pattern definitions for different difficulty levels
const patternDatabase = {
  easy: [
    { pattern: ['🔴', '🔴', '🔴'], options: ['🔴', '🔵', '🟡'] },
    { pattern: ['🔵', '🔵', '🔵'], options: ['🔵', '🔴', '🟡'] },
    { pattern: ['⭐', '⭐', '⭐'], options: ['⭐', '🌙', '☀️'] },
    { pattern: ['🎈', '🎈', '🎈'], options: ['🎈', '🎁', '🎉'] },
    { pattern: ['🐕', '🐕', '🐕'], options: ['🐕', '🐈', '🐦'] },
    { pattern: ['🔴', '🔵', '🔴', '🔵'], options: ['🔴', '🔵', '🟡'] },
    { pattern: ['⭐', '🌙', '⭐', '🌙'], options: ['⭐', '🌙', '☀️'] },
    { pattern: ['🍎', '🍎', '🍊', '🍊'], options: ['🍎', '🍊', '🍌'] },
    { pattern: ['💚', '💚', '💚'], options: ['💚', '💙', '💛'] },
    { pattern: ['🌸', '🌸', '🌸'], options: ['🌸', '🌺', '🌻'] },
    { pattern: ['🎮', '🎮', '🎮'], options: ['🎮', '🎲', '🃏'] },
    { pattern: ['🦋', '🦋', '🦋'], options: ['🦋', '🐝', '🐞'] },
    { pattern: ['🏠', '🏠', '🏠'], options: ['🏠', '🏡', '🏢'] },
    { pattern: ['☀️', '☀️', '☀️'], options: ['☀️', '🌙', '⭐'] },
    { pattern: ['🍕', '🍕', '🍕'], options: ['🍕', '🍔', '🌮'] },
    { pattern: ['🚗', '🚗', '🚗'], options: ['🚗', '🚕', '🚙'] },
  ],
  medium: [
    { pattern: ['🔴', '🔵', '🟡', '🔴', '🔵'], options: ['🟡', '🔴', '🔵'] },
    { pattern: ['⭐', '⭐', '🌙', '⭐', '⭐'], options: ['🌙', '⭐', '☀️'] },
    { pattern: ['🎈', '🎁', '🎉', '🎈', '🎁'], options: ['🎉', '🎈', '🎁'] },
    { pattern: ['🐕', '🐈', '🐦', '🐕', '🐈'], options: ['🐦', '🐕', '🐈'] },
    { pattern: ['1️⃣', '2️⃣', '3️⃣', '1️⃣', '2️⃣'], options: ['3️⃣', '1️⃣', '2️⃣'] },
    { pattern: ['🔴', '🔴', '🔵', '🔴', '🔴'], options: ['🔵', '🔴', '🟡'] },
    { pattern: ['🍎', '🍊', '🍌', '🍎', '🍊'], options: ['🍌', '🍎', '🍊'] },
    { pattern: ['💚', '💙', '💛', '💚', '💙'], options: ['💛', '💚', '💙'] },
    { pattern: ['🌸', '🌺', '🌻', '🌸', '🌺'], options: ['🌻', '🌸', '🌺'] },
    { pattern: ['🎮', '🎲', '🃏', '🎮', '🎲'], options: ['🃏', '🎮', '🎲'] },
    { pattern: ['🦋', '🦋', '🐝', '🦋', '🦋'], options: ['🐝', '🦋', '🐞'] },
    { pattern: ['🏠', '🏡', '🏢', '🏠', '🏡'], options: ['🏢', '🏠', '🏡'] },
    { pattern: ['☀️', '🌙', '⭐', '☀️', '🌙'], options: ['⭐', '☀️', '🌙'] },
    { pattern: ['🍕', '🍔', '🌮', '🍕', '🍔'], options: ['🌮', '🍕', '🍔'] },
    { pattern: ['🚗', '🚕', '🚙', '🚗', '🚕'], options: ['🚙', '🚗', '🚕'] },
    { pattern: ['👑', '💎', '🏆', '👑', '💎'], options: ['🏆', '👑', '💎'] },
    { pattern: ['🎸', '🎹', '🎺', '🎸', '🎹'], options: ['🎺', '🎸', '🎹'] },
    { pattern: ['📚', '📖', '✏️', '📚', '📖'], options: ['✏️', '📚', '📖'] },
  ],
  hard: [
    { pattern: ['🔴', '🔵', '🟡', '🔴', '🔵', '🟡'], options: ['🔴', '🔵', '🟡'] },
    { pattern: ['⭐', '⭐', '🌙', '⭐', '⭐', '🌙'], options: ['⭐', '🌙', '☀️'] },
    { pattern: ['1️⃣', '1️⃣', '2️⃣', '1️⃣', '1️⃣', '2️⃣'], options: ['1️⃣', '2️⃣', '3️⃣'] },
    { pattern: ['🎈', '🎁', '🎁', '🎈', '🎁', '🎁'], options: ['🎈', '🎁', '🎉'] },
    { pattern: ['🐕', '🐈', '🐈', '🐦', '🐕', '🐈'], options: ['🐈', '🐦', '🐕'] },
    { pattern: ['💚', '💙', '💛', '💜', '💚', '💙'], options: ['💛', '💜', '💚'] },
    { pattern: ['🌸', '🌺', '🌻', '🌸', '🌺', '🌻'], options: ['🌸', '🌺', '🌻'] },
    { pattern: ['🍎', '🍊', '🍌', '🍇', '🍎', '🍊'], options: ['🍌', '🍇', '🍎'] },
    { pattern: ['🎮', '🎲', '🎲', '🃏', '🎮', '🎲'], options: ['🎲', '🃏', '🎮'] },
    { pattern: ['🦋', '🐝', '🐞', '🦋', '🐝', '🐞'], options: ['🦋', '🐝', '🐞'] },
    { pattern: ['🏠', '🏠', '🏡', '🏢', '🏠', '🏠'], options: ['🏡', '🏢', '🏠'] },
    { pattern: ['☀️', '☀️', '🌙', '⭐', '☀️', '☀️'], options: ['🌙', '⭐', '☀️'] },
    { pattern: ['🍕', '🍔', '🌮', '🍟', '🍕', '🍔'], options: ['🌮', '🍟', '🍕'] },
    { pattern: ['🚗', '🚕', '🚙', '🚌', '🚗', '🚕'], options: ['🚙', '🚌', '🚗'] },
    { pattern: ['👑', '💎', '💎', '🏆', '👑', '💎'], options: ['💎', '🏆', '👑'] },
    { pattern: ['🎸', '🎹', '🎺', '🎻', '🎸', '🎹'], options: ['🎺', '🎻', '🎸'] },
    { pattern: ['📚', '📖', '✏️', '📝', '📚', '📖'], options: ['✏️', '📝', '📚'] },
    { pattern: ['🌈', '☁️', '⛅', '🌤️', '🌈', '☁️'], options: ['⛅', '🌤️', '🌈'] },
    { pattern: ['🍓', '🍒', '🍑', '🍐', '🍓', '🍒'], options: ['🍑', '🍐', '🍓'] },
    { pattern: ['⚽', '🏀', '🎾', '⚾', '⚽', '🏀'], options: ['🎾', '⚾', '⚽'] },
  ]
};

let currentDifficulty = 'easy';
let currentPatternIndex = 0;
let score = 0;
let usedPatterns = new Set();
let gameActive = true;

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
  setupDifficultyButtons();
  loadNewPattern();
});

// Setup difficulty selector
function setupDifficultyButtons() {
  const buttons = document.querySelectorAll('.difficulty-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active state from all buttons
      buttons.forEach(b => b.classList.remove('active'));
      // Add active state to clicked button
      this.classList.add('active');
      currentDifficulty = this.dataset.difficulty;
      score = 0;
      usedPatterns.clear();
      currentPatternIndex = 0;
      updateScore();
      loadNewPattern();
    });
  });
}

// Load a new pattern
function loadNewPattern() {
  const patterns = patternDatabase[currentDifficulty];
  
  // Get a random pattern that hasn't been used yet
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * patterns.length);
  } while (usedPatterns.has(randomIndex) && usedPatterns.size < patterns.length);
  
  // Reset if all patterns have been used
  if (usedPatterns.size >= patterns.length) {
    usedPatterns.clear();
  }
  
  usedPatterns.add(randomIndex);
  const currentPattern = patterns[randomIndex];
  
  displayPattern(currentPattern.pattern, currentPattern.options);
}

// Display the pattern and answer options
function displayPattern(pattern, options) {
  gameActive = false;
  
  // Display pattern sequence
  const sequenceDiv = document.getElementById('pattern-sequence');
  sequenceDiv.innerHTML = '';
  
  pattern.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'pattern-item';
    itemDiv.textContent = item;
    itemDiv.style.animationDelay = `${index * 0.1}s`;
    sequenceDiv.appendChild(itemDiv);
  });
  
  // Add question mark
  const questionDiv = document.createElement('div');
  questionDiv.className = 'pattern-item question';
  questionDiv.textContent = '?';
  questionDiv.style.animationDelay = `${pattern.length * 0.1}s`;
  sequenceDiv.appendChild(questionDiv);
  
  // Hide feedback section and display answer options
  document.getElementById('feedback-section').style.display = 'none';
  document.getElementById('answer-buttons').innerHTML = '';
  
  // Shuffle answer options
  const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
  
  // Create answer buttons
  shuffledOptions.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, options[0], btn);
    btn.style.animationDelay = `${pattern.length * 0.1 + index * 0.1}s`;
    document.getElementById('answer-buttons').appendChild(btn);
  });
  
  // Disable all buttons while they're loading
  setTimeout(() => {
    gameActive = true;
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = false);
  }, (pattern.length + shuffledOptions.length) * 100);
}

// Check if answer is correct
function checkAnswer(selected, correct, btnElement) {
  if (!gameActive) return;
  gameActive = false;
  
  const feedbackDiv = document.getElementById('feedback-section');
  const messageDiv = document.getElementById('feedback-message');
  const buttons = document.querySelectorAll('.answer-btn');
  
  // Disable all buttons
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.add('disabled');
  });
  
  // Check if answer is correct
  if (selected === correct) {
    messageDiv.textContent = '🎉 Awesome! You got it right!';
    messageDiv.className = 'feedback-message correct';
    score += 10;
    updateScore();
    playCorrectSound();
    celebrateSuccess();
  } else {
    messageDiv.textContent = `❌ Oops! The answer is ${correct}. Try again next time!`;
    messageDiv.className = 'feedback-message incorrect';
    playIncorrectSound();
  }
  
  feedbackDiv.style.display = 'block';
}

// Go to next pattern
function nextPattern() {
  loadNewPattern();
}

// Update score display
function updateScore() {
  document.getElementById('score').textContent = score;
}

// Play correct sound
async function playCorrectSound() {
  const synth = window.speechSynthesis;
  if (synth) {
    const utterance = new SpeechSynthesisUtterance('Excellent!');
    utterance.rate = 0.8;
    utterance.pitch = 1.3;
    synth.speak(utterance);
  }
}

// Play incorrect sound
async function playIncorrectSound() {
  const synth = window.speechSynthesis;
  if (synth) {
    const utterance = new SpeechSynthesisUtterance('Try again');
    utterance.rate = 0.8;
    synth.speak(utterance);
  }
}

// Celebrate with confetti
function celebrateSuccess() {
  const celebration = document.getElementById('celebration');
  celebration.style.display = 'block';
  
  // Create confetti pieces
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.delay = Math.random() * 0.5 + 's';
    confetti.style.background = ['#667eea', '#764ba2', '#f093fb', '#4facfe'][Math.floor(Math.random() * 4)];
    celebration.appendChild(confetti);
  }
  
  // Clear confetti after animation
  setTimeout(() => {
    celebration.innerHTML = '';
    celebration.style.display = 'none';
  }, 3500);
}

// Go back button
function goBack() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#logic-section';
}

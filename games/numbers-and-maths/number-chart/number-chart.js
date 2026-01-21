// Number Chart Logic

// Number Chart state
const numberRanges = [
  { label: '1–10', start: 1, end: 10 },
  { label: '10–20', start: 10, end: 20 },
  { label: '20–30', start: 20, end: 30 },
  { label: '30–40', start: 30, end: 40 },
  { label: '40–50', start: 40, end: 50 },
];
let currentRange = numberRanges[0];
let gameUnlocked = false;
let currentLevel = 1;

// Level 2 state
let gapRangeStart = 1;
let gapRangeEnd = 10;
let currentQuestion = null;
let score = 0;
let questionsAnswered = 0;

// Level 3 state
let raceRangeStart = 1;
let raceRangeEnd = 10;
let raceDifficulty = 'easy';
let raceNumbers = [];
let currentRaceIndex = 0;
let raceStartTime = 0;
let raceTimer = null;
let raceActive = false;
let bestTimes = {}; // Store best times per range-difficulty combo

// Celebration messages
const celebrationMessages = [
  '🎉 Great!',
  '⭐ Awesome!',
  '🌟 Fantastic!',
  '💫 Excellent!',
  '🎊 Wonderful!',
  '✨ Super!',
  '🎈 Perfect!',
  '🚀 Amazing!',
];

// Celebration emojis for confetti
const celebrationEmojis = ['🎉', '⭐', '🎈', '🌟', '💫', '✨', '🎊', '🎁', '🎀', '🌈'];

// Navigation function
function goBack() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#numbers-section';
}

function showGuide() {
  const overlay = document.getElementById('guide-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function hideGuideAndStart() {
  const overlay = document.getElementById('guide-overlay');
  if (overlay) overlay.style.display = 'none';
  gameUnlocked = true;
}

function createConfetti() {
  const container = document.getElementById('confetti-container');
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-20px';
    confetti.style.fontSize = '20px';
    confetti.style.backgroundColor = 'transparent';
    container.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 2000);
  }
}

function showCelebration() {
  const message = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
  const msgElement = document.getElementById('celebration-message');
  msgElement.textContent = message;
  msgElement.style.animation = 'none';
  
  // Trigger animation
  setTimeout(() => {
    msgElement.style.animation = 'fadeInOut 1.5s ease-in-out';
  }, 10);
  
  createConfetti();
}

function renderRangeSelector() {
  const selector = document.getElementById('range-selector');
  if (!selector) return;
  // Buttons exist in HTML, attach handlers and active state
  const buttons = selector.querySelectorAll('.range-btn');
  buttons.forEach(btn => {
    const start = Number(btn.getAttribute('data-start'));
    const end = Number(btn.getAttribute('data-end'));
    btn.onclick = () => {
      currentRange = { label: `${start}–${end}`, start, end };
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      if (typeof speakText === 'function' && window.audioReady) {
        speakText(`Let's count ${start} to ${end}.`);
      } else {
        speechSynthesis.cancel();
        speechSynthesis.speak(new SpeechSynthesisUtterance(`Let's count ${start} to ${end}.`));
      }
      renderNumberGrid(start, end);
    };
    // Set initial active on first load
    if (start === currentRange.start && end === currentRange.end) {
      btn.classList.add('active');
    }
  });
}

function renderNumberGrid(start, end) {
  const grid = document.getElementById('number-grid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let n = start; n <= end; n++) {
    const tile = document.createElement('button');
    tile.className = 'number-tile';
    tile.textContent = n;
    tile.setAttribute('aria-label', `Number ${n}`);
    tile.addEventListener('click', () => {
      // Add click animation
      tile.classList.add('clicked');
      setTimeout(() => tile.classList.remove('clicked'), 600);
      
      if (typeof speakText === 'function' && window.audioReady) {
        speakText(n);
      } else {
        speechSynthesis.cancel();
        speechSynthesis.speak(new SpeechSynthesisUtterance(String(n)));
      }
      
      // Show celebration every 3 clicks
      if (Math.random() > 0.7) {
        showCelebration();
      }
    });
    grid.appendChild(tile);
  }
}

// Level switching functionality
function switchLevel(level) {
  currentLevel = level;
  
  // Update level buttons
  const levelButtons = document.querySelectorAll('.level-btn');
  levelButtons.forEach(btn => {
    btn.classList.toggle('active', Number(btn.getAttribute('data-level')) === level);
  });
  
  // Show/hide level content
  const level1Content = document.getElementById('level-1-content');
  const level2Content = document.getElementById('level-2-content');
  const level3Content = document.getElementById('level-3-content');
  
  if (level === 1) {
    level1Content.style.display = 'block';
    level2Content.style.display = 'none';
    level3Content.style.display = 'none';
  } else if (level === 2) {
    level1Content.style.display = 'none';
    level2Content.style.display = 'block';
    level3Content.style.display = 'none';
    renderGapRangeSelector();
  } else if (level === 3) {
    level1Content.style.display = 'none';
    level2Content.style.display = 'none';
    level3Content.style.display = 'block';
    initializeRaceLevel();
  }
}

// Level 2: Fill the Gaps functionality
function renderGapRangeSelector() {
  const selector = document.getElementById('gap-range-selector');
  if (!selector) return;
  
  const buttons = selector.querySelectorAll('.range-btn');
  buttons.forEach(btn => {
    const start = Number(btn.getAttribute('data-start'));
    const end = Number(btn.getAttribute('data-end'));
    btn.onclick = () => {
      gapRangeStart = start;
      gapRangeEnd = end;
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      
      if (typeof speakText === 'function' && window.audioReady) {
        speakText(`Let's find missing numbers from ${start} to ${end}.`);
      } else {
        speechSynthesis.cancel();
        speechSynthesis.speak(new SpeechSynthesisUtterance(`Let's find missing numbers from ${start} to ${end}.`));
      }
      
      generateGapQuestion();
    };
    
    // Set initial active on first load
    if (start === 1 && end === 10) {
      btn.classList.add('active');
    }
  });
}

function generateGapQuestion() {
  // Generate a sequence of 5 numbers with one missing
  const rangeSize = gapRangeEnd - gapRangeStart + 1;
  const sequenceLength = Math.min(5, rangeSize);
  
  // Pick a random starting point that allows for a full sequence
  const maxStart = gapRangeEnd - sequenceLength + 1;
  const sequenceStart = gapRangeStart + Math.floor(Math.random() * (maxStart - gapRangeStart + 1));
  
  // Generate the sequence
  const sequence = [];
  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(sequenceStart + i);
  }
  
  // Pick a random position to remove (not first or last for better gameplay)
  const gapIndex = 1 + Math.floor(Math.random() * (sequenceLength - 2));
  const correctAnswer = sequence[gapIndex];
  sequence[gapIndex] = '?';
  
  // Generate wrong answers
  const wrongAnswers = [];
  while (wrongAnswers.length < 3) {
    let wrongNum = gapRangeStart + Math.floor(Math.random() * (gapRangeEnd - gapRangeStart + 1));
    if (wrongNum !== correctAnswer && !wrongAnswers.includes(wrongNum)) {
      wrongAnswers.push(wrongNum);
    }
  }
  
  // Combine and shuffle answers
  const allAnswers = [correctAnswer, ...wrongAnswers];
  allAnswers.sort(() => Math.random() - 0.5);
  
  currentQuestion = {
    sequence,
    correctAnswer,
    allAnswers,
    answered: false
  };
  
  renderGapQuestion();
}

function renderGapQuestion() {
  if (!currentQuestion) return;
  
  // Render sequence
  const sequenceDisplay = document.getElementById('sequence-display');
  sequenceDisplay.innerHTML = '';
  
  currentQuestion.sequence.forEach(num => {
    const numBox = document.createElement('div');
    numBox.className = 'sequence-number';
    if (num === '?') {
      numBox.classList.add('missing');
    }
    numBox.textContent = num;
    sequenceDisplay.appendChild(numBox);
  });
  
  // Render answer options
  const optionsContainer = document.getElementById('answer-options');
  optionsContainer.innerHTML = '';
  
  currentQuestion.allAnswers.forEach(answer => {
    const optionBtn = document.createElement('button');
    optionBtn.className = 'answer-option';
    optionBtn.textContent = answer;
    optionBtn.onclick = () => checkAnswer(answer, optionBtn);
    optionsContainer.appendChild(optionBtn);
  });
  
  // Hide next button
  document.getElementById('next-question-btn').style.display = 'none';
}

function checkAnswer(selectedAnswer, button) {
  if (currentQuestion.answered) return;
  
  const allButtons = document.querySelectorAll('.answer-option');
  
  if (selectedAnswer === currentQuestion.correctAnswer) {
    currentQuestion.answered = true;
    questionsAnswered++;
    
    button.classList.add('correct');
    score++;
    updateScore();
    
    // Fill in the missing slot with the correct answer
    const sequenceNumbers = document.querySelectorAll('.sequence-number');
    sequenceNumbers.forEach(numBox => {
      if (numBox.textContent === '?') {
        numBox.textContent = selectedAnswer;
        numBox.classList.remove('missing');
        numBox.classList.add('filled-correct');
      }
    });
    
    // Disable all buttons
    allButtons.forEach(btn => btn.disabled = true);
    
    if (typeof speakText === 'function' && window.audioReady) {
      speakText(`Correct! The answer is ${selectedAnswer}!`);
    } else {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(`Correct! The answer is ${selectedAnswer}!`));
    }
    
    showCelebration();
    
    // Show next question button
    document.getElementById('next-question-btn').style.display = 'block';
  } else {
    // Wrong answer - mark it incorrect but allow retry
    button.classList.add('incorrect');
    button.disabled = true;
    
    if (typeof speakText === 'function' && window.audioReady) {
      speakText(`Try again!`);
    } else {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(`Try again!`));
    }
  }
}

function updateScore() {
  document.getElementById('score').textContent = score;
}

function nextQuestion() {
  generateGapQuestion();
}

// ===============================
// LEVEL 3: NUMBER RACE FUNCTIONS
// ===============================

function initializeRaceLevel() {
  loadBestTimes();
  renderRaceDifficultySelector();
  renderRaceRangeSelector();
  displayBestTimes();
}

function renderRaceDifficultySelector() {
  const selector = document.getElementById('difficulty-selector');
  if (!selector) return;
  
  const buttons = selector.querySelectorAll('.difficulty-btn');
  buttons.forEach(btn => {
    const difficulty = btn.getAttribute('data-difficulty');
    btn.onclick = () => {
      raceDifficulty = difficulty;
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      resetRace();
    };
  });
}

function renderRaceRangeSelector() {
  const selector = document.getElementById('race-range-selector');
  if (!selector) return;
  
  const buttons = selector.querySelectorAll('.range-btn');
  buttons.forEach(btn => {
    const start = Number(btn.getAttribute('data-start'));
    const end = Number(btn.getAttribute('data-end'));
    btn.onclick = () => {
      raceRangeStart = start;
      raceRangeEnd = end;
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      
      if (typeof speakText === 'function' && window.audioReady) {
        speakText(`Ready to race with numbers ${start} to ${end}!`);
      } else {
        speechSynthesis.cancel();
        speechSynthesis.speak(new SpeechSynthesisUtterance(`Ready to race with numbers ${start} to ${end}!`));
      }
      
      resetRace();
    };
    
    // Set initial active on first load
    if (start === 1 && end === 10) {
      btn.classList.add('active');
    }
  });
}

function resetRace() {
  raceActive = false;
  currentRaceIndex = 0;
  
  if (raceTimer) {
    clearInterval(raceTimer);
    raceTimer = null;
  }
  
  document.getElementById('timer').textContent = '0.0s';
  document.getElementById('next-number').textContent = '-';
  document.getElementById('progress').textContent = '0/0';
  document.getElementById('progress-bar').style.width = '0%';
  document.getElementById('race-grid').innerHTML = '';
  document.getElementById('race-result').style.display = 'none';
  document.getElementById('start-race-btn').style.display = 'block';
}

function startRace() {
  // Generate numbers based on difficulty
  const rangeSize = raceRangeEnd - raceRangeStart + 1;
  let count;
  
  if (raceDifficulty === 'easy') {
    count = Math.min(5, rangeSize);
  } else {
    count = Math.min(10, rangeSize);
  }
  
  // Pick random consecutive numbers from the range
  const maxStart = raceRangeEnd - count + 1;
  const sequenceStart = raceRangeStart + Math.floor(Math.random() * (maxStart - raceRangeStart + 1));
  
  raceNumbers = [];
  for (let i = 0; i < count; i++) {
    raceNumbers.push(sequenceStart + i);
  }
  
  currentRaceIndex = 0;
  raceActive = true;
  raceStartTime = Date.now();
  
  // Hide start button
  document.getElementById('start-race-btn').style.display = 'none';
  
  // Update UI
  updateRaceUI();
  
  // Render scrambled grid
  renderRaceGrid();
  
  // Start timer
  raceTimer = setInterval(updateTimer, 100);
  
  if (typeof speakText === 'function' && window.audioReady) {
    speakText('Go!');
  } else {
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance('Go!'));
  }
}

function renderRaceGrid() {
  const grid = document.getElementById('race-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  // Scramble the numbers
  const scrambled = [...raceNumbers].sort(() => Math.random() - 0.5);
  
  scrambled.forEach(num => {
    const tile = document.createElement('button');
    tile.className = 'race-tile';
    tile.textContent = num;
    tile.setAttribute('data-number', num);
    tile.onclick = () => handleRaceTileClick(num, tile);
    grid.appendChild(tile);
  });
}

function handleRaceTileClick(num, tile) {
  if (!raceActive) return;
  
  const expectedNumber = raceNumbers[currentRaceIndex];
  
  if (num === expectedNumber) {
    // Correct number!
    tile.classList.add('race-correct');
    tile.disabled = true;
    
    currentRaceIndex++;
    updateRaceUI();
    
    if (typeof speakText === 'function' && window.audioReady) {
      speakText(num);
    } else {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(String(num)));
    }
    
    // Check if race is complete
    if (currentRaceIndex >= raceNumbers.length) {
      completeRace();
    }
  } else {
    // Wrong number - shake animation
    tile.classList.add('race-wrong');
    setTimeout(() => tile.classList.remove('race-wrong'), 500);
    
    if (typeof speakText === 'function' && window.audioReady) {
      speakText('Try again!');
    } else {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance('Try again!'));
    }
  }
}

function updateTimer() {
  const elapsed = (Date.now() - raceStartTime) / 1000;
  document.getElementById('timer').textContent = elapsed.toFixed(1) + 's';
}

function updateRaceUI() {
  const nextNum = currentRaceIndex < raceNumbers.length ? raceNumbers[currentRaceIndex] : '✓';
  document.getElementById('next-number').textContent = nextNum;
  document.getElementById('progress').textContent = `${currentRaceIndex}/${raceNumbers.length}`;
  
  const progressPercent = (currentRaceIndex / raceNumbers.length) * 100;
  document.getElementById('progress-bar').style.width = progressPercent + '%';
}

function completeRace() {
  raceActive = false;
  clearInterval(raceTimer);
  
  const finalTime = (Date.now() - raceStartTime) / 1000;
  
  // Calculate star rating based on difficulty and time
  let stars = 1;
  let timeThresholds;
  
  if (raceDifficulty === 'easy') {
    timeThresholds = [5, 8]; // 3 stars < 5s, 2 stars < 8s, 1 star >= 8s
  } else if (raceDifficulty === 'medium') {
    timeThresholds = [10, 15];
  } else { // hard
    timeThresholds = [8, 12];
  }
  
  if (finalTime < timeThresholds[0]) {
    stars = 3;
  } else if (finalTime < timeThresholds[1]) {
    stars = 2;
  }
  
  // Check and save best time
  const raceKey = `${raceRangeStart}-${raceRangeEnd}-${raceDifficulty}`;
  const isNewBest = !bestTimes[raceKey] || finalTime < bestTimes[raceKey];
  
  if (isNewBest) {
    bestTimes[raceKey] = finalTime;
    saveBestTimes();
  }
  
  // Show results
  showRaceResults(finalTime, stars, isNewBest);
  displayBestTimes();
}

function showRaceResults(time, stars, isNewBest) {
  const resultDiv = document.getElementById('race-result');
  const starsDiv = document.getElementById('result-stars');
  const timeDiv = document.getElementById('result-time');
  const messageDiv = document.getElementById('result-message');
  
  // Show stars
  starsDiv.innerHTML = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  
  // Show time
  timeDiv.textContent = `Time: ${time.toFixed(2)}s`;
  
  // Show message
  let message = '';
  if (stars === 3) {
    message = isNewBest ? '🏆 Amazing! New Best Time!' : '🌟 Perfect! Lightning Fast!';
  } else if (stars === 2) {
    message = isNewBest ? '🎉 Great! New Best Time!' : '👍 Great Job!';
  } else {
    message = isNewBest ? '✨ Good! New Best Time!' : '💪 Keep Practicing!';
  }
  messageDiv.textContent = message;
  
  resultDiv.style.display = 'block';
  
  if (isNewBest) {
    showCelebration();
  }
  
  if (typeof speakText === 'function' && window.audioReady) {
    speakText(message);
  } else {
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(message));
  }
}

function displayBestTimes() {
  const listDiv = document.getElementById('best-times-list');
  if (!listDiv) return;
  
  listDiv.innerHTML = '';
  
  const ranges = [
    { start: 1, end: 10, label: '1-10' },
    { start: 11, end: 20, label: '11-20' },
    { start: 21, end: 30, label: '21-30' },
    { start: 31, end: 40, label: '31-40' },
    { start: 41, end: 50, label: '41-50' }
  ];
  
  const difficulties = ['easy', 'medium', 'hard'];
  const difficultyLabels = { easy: '⭐ Easy', medium: '⭐⭐ Medium', hard: '⭐⭐⭐ Hard' };
  
  let hasTimes = false;
  
  ranges.forEach(range => {
    difficulties.forEach(diff => {
      const key = `${range.start}-${range.end}-${diff}`;
      if (bestTimes[key]) {
        hasTimes = true;
        const timeItem = document.createElement('div');
        timeItem.className = 'best-time-item';
        timeItem.innerHTML = `
          <span class="time-label">${range.label} - ${difficultyLabels[diff]}</span>
          <span class="time-value">${bestTimes[key].toFixed(2)}s</span>
        `;
        listDiv.appendChild(timeItem);
      }
    });
  });
  
  if (!hasTimes) {
    listDiv.innerHTML = '<p class="no-times">No times recorded yet. Start racing!</p>';
  }
}

function loadBestTimes() {
  try {
    const saved = localStorage.getItem('numberRaceBestTimes');
    if (saved) {
      bestTimes = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading best times:', e);
  }
}

function saveBestTimes() {
  try {
    localStorage.setItem('numberRaceBestTimes', JSON.stringify(bestTimes));
  } catch (e) {
    console.error('Error saving best times:', e);
  }
}

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', function() {
  // Set up guide buttons
  const guideStartBtn = document.getElementById('guide-start');
  const openGuideBtn = document.getElementById('open-guide');

  if (guideStartBtn) {
    guideStartBtn.addEventListener('click', hideGuideAndStart);
  }

  if (openGuideBtn) {
    openGuideBtn.addEventListener('click', showGuide);
  }

  // Show guide first
  showGuide();

  // Initialize Level buttons
  const levelButtons = document.querySelectorAll('.level-btn');
  levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const level = Number(btn.getAttribute('data-level'));
      switchLevel(level);
    });
  });

  // Initialize Level 1 - Number Chart
  renderRangeSelector();
  renderNumberGrid(currentRange.start, currentRange.end);
  
  // Initialize Next Question button for Level 2
  const nextBtn = document.getElementById('next-question-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', nextQuestion);
  }
  
  // Initialize Level 3 buttons
  const startRaceBtn = document.getElementById('start-race-btn');
  if (startRaceBtn) {
    startRaceBtn.addEventListener('click', startRace);
  }
  
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', resetRace);
  }
});


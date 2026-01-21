// Count Objects Game Logic
let currentCountingAnswer = 0;
let countingScore = 0;
let countingLevel = 1;
const countingObjects = ['🍎', '⭐', '🎈', '🦋', '🌸', '🎁', '🐸', '⚽', '🍕', '🚗'];
let gameUnlocked = false;
let currentGameLevel = 1;

// Level 2 state
let level2TargetNumber = 0;
let level2SelectedCount = 0;
let level2ObjectEmoji = '';

// Level 3 state
let level3LeftCount = 0;
let level3RightCount = 0;
let level3ObjectLeft = '';
let level3ObjectRight = '';

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
  generateCountingQuestion();
}

function generateCountingQuestion() {
  if (!gameUnlocked) {
    showGuide();
    return;
  }
  // Generate a number between 1 and Math.min(50, level * 10)
  const maxCount = Math.min(50, countingLevel * 10);
  currentCountingAnswer = Math.floor(Math.random() * maxCount) + 1;
  
  // Select a random object emoji
  const objectEmoji = countingObjects[Math.floor(Math.random() * countingObjects.length)];
  
  // Display objects
  const objectsDisplay = document.getElementById('objects-display');
  if (objectsDisplay) {
    objectsDisplay.innerHTML = '';
    for (let i = 0; i < currentCountingAnswer; i++) {
      const objectElement = document.createElement('span');
      objectElement.textContent = objectEmoji;
      objectElement.className = 'counting-object';
      objectElement.style.animation = `fadeIn 0.3s ease-in-out ${i * 0.1}s both`;
      objectsDisplay.appendChild(objectElement);
    }
  }
  
  // Generate number choices
  generateNumberChoices();
}

function generateNumberChoices() {
  const choicesContainer = document.getElementById('number-choices');
  if (!choicesContainer) return;
  
  choicesContainer.innerHTML = '';
  
  // Generate 4 choices including the correct answer
  const choices = new Set();
  choices.add(currentCountingAnswer);
  
  // Add 3 other numbers
  while (choices.size < 4) {
    const choice = Math.floor(Math.random() * Math.min(50, countingLevel * 10)) + 1;
    choices.add(choice);
  }
  
  // Shuffle and display choices
  const choicesArray = Array.from(choices).sort(() => Math.random() - 0.5);
  
  choicesArray.forEach(number => {
    const button = document.createElement('button');
    button.textContent = number;
    button.className = 'number-choice';
    button.addEventListener('click', () => checkCountingAnswer(number, button));
    choicesContainer.appendChild(button);
  });
}

function checkCountingAnswer(selectedNumber, buttonElement) {
  const isCorrect = selectedNumber === currentCountingAnswer;
  
  // Disable all buttons temporarily
  const allButtons = document.querySelectorAll('.number-choice');
  allButtons.forEach(btn => btn.style.pointerEvents = 'none');
  
  if (isCorrect) {
    buttonElement.style.background = '#28a745';
    buttonElement.style.color = 'white';
    buttonElement.style.borderColor = '#28a745';
    countingScore += 10;
    
    // Update score display
    const scoreElement = document.getElementById('count-score');
    if (scoreElement) scoreElement.textContent = countingScore;
    
    // Level up every 50 points
    if (countingScore % 50 === 0) {
      countingLevel++;
      const levelElement = document.getElementById('count-level');
      if (levelElement) levelElement.textContent = countingLevel;
    }
    
    // Say "Correct!" or similar
    speakText(`Correct! The answer is ${currentCountingAnswer}!`);
    
    // Generate new question after a short delay
    setTimeout(() => {
      generateCountingQuestion();
      // Re-enable buttons
      const newButtons = document.querySelectorAll('.number-choice');
      newButtons.forEach(btn => btn.style.pointerEvents = 'auto');
    }, 500);
  } else {
    buttonElement.style.background = '#dc3545';
    buttonElement.style.color = 'white';
    buttonElement.style.borderColor = '#dc3545';
    speakText(`Not quite! Try again. Count the objects carefully.`);
    
    // Re-enable buttons and reset incorrect button after a moment
    setTimeout(() => {
      buttonElement.style.background = 'white';
      buttonElement.style.color = '#007bff';
      buttonElement.style.borderColor = '#007bff';
      allButtons.forEach(btn => btn.style.pointerEvents = 'auto');
    }, 1000);
  }
}

function hearCount() {
  if (!gameUnlocked) {
    showGuide();
    return;
  }
  const objectText = currentCountingAnswer === 1 ? 'object' : 'objects';
  speakText(`Count the objects. There are ${currentCountingAnswer} ${objectText}.`);
}

/* ==============================
   LEVEL SWITCHING
================================ */

function switchCountingLevel(level) {
  currentGameLevel = level;
  
  // Update level buttons
  const levelButtons = document.querySelectorAll('.level-btn');
  levelButtons.forEach(btn => {
    btn.classList.toggle('active', Number(btn.getAttribute('data-level')) === level);
  });
  
  // Show/hide level content
  const level1Content = document.getElementById('level-1-content');
  const level2Content = document.getElementById('level-2-content');
  const level3Content = document.getElementById('level-3-content');
  
  level1Content.style.display = level === 1 ? 'block' : 'none';
  level2Content.style.display = level === 2 ? 'block' : 'none';
  level3Content.style.display = level === 3 ? 'block' : 'none';
  
  if (level === 1) {
    generateCountingQuestion();
  } else if (level === 2) {
    generateLevel2Question();
  } else if (level === 3) {
    generateLevel3Question();
  }
}

/* ==============================
   LEVEL 2: SHOW ME THAT MANY
================================ */

function generateLevel2Question() {
  if (!gameUnlocked) {
    showGuide();
    return;
  }
  
  const maxCount = Math.min(20, 5 + countingLevel);
  level2TargetNumber = Math.floor(Math.random() * maxCount) + 1;
  level2SelectedCount = 0;
  level2ObjectEmoji = countingObjects[Math.floor(Math.random() * countingObjects.length)];
  
  // Update instruction
  const instruction = document.getElementById('level2-instruction');
  instruction.textContent = `Click exactly ${level2TargetNumber} ${level2ObjectEmoji}!`;
  
  const hint = document.getElementById('level2-hint');
  hint.textContent = `You need to click ${level2TargetNumber} object${level2TargetNumber > 1 ? 's' : ''}. Clicks so far: 0/${level2TargetNumber}`;
  
  // Clear feedback
  const feedback = document.getElementById('level2-feedback');
  feedback.innerHTML = '';
  feedback.style.display = 'none';
  
  // Generate clickable objects
  const objectsContainer = document.getElementById('clickable-objects');
  objectsContainer.innerHTML = '';
  
  const objectCount = level2TargetNumber + Math.floor(Math.random() * 5) + 2; // More objects than needed
  
  for (let i = 0; i < objectCount; i++) {
    const objButton = document.createElement('button');
    objButton.className = 'clickable-object';
    objButton.textContent = level2ObjectEmoji;
    objButton.addEventListener('click', () => handleLevel2Click(objButton));
    objectsContainer.appendChild(objButton);
  }
  
  speakText(`Click exactly ${level2TargetNumber} objects!`);
}

function handleLevel2Click(button) {
  if (!gameUnlocked || button.classList.contains('level2-clicked')) return;
  
  button.classList.add('level2-clicked');
  level2SelectedCount++;
  
  // Update hint
  const hint = document.getElementById('level2-hint');
  hint.textContent = `You need to click ${level2TargetNumber} object${level2TargetNumber > 1 ? 's' : ''}. Clicks so far: ${level2SelectedCount}/${level2TargetNumber}`;
  
  // Check if user got the right number
  if (level2SelectedCount === level2TargetNumber) {
    // Correct!
    countingScore += 10;
    document.getElementById('count-score').textContent = countingScore;
    
    if (countingScore % 50 === 0) {
      countingLevel++;
      document.getElementById('count-level').textContent = countingLevel;
    }
    
    const feedback = document.getElementById('level2-feedback');
    feedback.innerHTML = '✅ Perfect! You got it right!';
    feedback.style.display = 'block';
    feedback.style.color = '#28a745';
    
    speakText(`Perfect! You clicked exactly ${level2TargetNumber} objects!`);
    
    // Disable all buttons
    const allObjects = document.querySelectorAll('.clickable-object');
    allObjects.forEach(obj => obj.style.pointerEvents = 'none');
  } else if (level2SelectedCount > level2TargetNumber) {
    // Too many!
    const feedback = document.getElementById('level2-feedback');
    feedback.innerHTML = `❌ Too many! You clicked ${level2SelectedCount}, but you need ${level2TargetNumber}.`;
    feedback.style.display = 'block';
    feedback.style.color = '#dc3545';
    
    speakText(`Too many clicks! You need ${level2TargetNumber}.`);
  }
}

function resetLevel2() {
  level2SelectedCount = 0;
  const allObjects = document.querySelectorAll('.clickable-object');
  allObjects.forEach(obj => {
    obj.classList.remove('level2-clicked');
    obj.style.pointerEvents = 'auto';
  });
}

/* ==============================
   LEVEL 3: MORE OR LESS?
================================ */

function generateLevel3Question() {
  if (!gameUnlocked) {
    showGuide();
    return;
  }
  
  const maxCount = Math.min(15, 3 + countingLevel);
  level3LeftCount = Math.floor(Math.random() * maxCount) + 1;
  level3RightCount = Math.floor(Math.random() * maxCount) + 1;
  level3ObjectLeft = countingObjects[Math.floor(Math.random() * countingObjects.length)];
  level3ObjectRight = countingObjects[Math.floor(Math.random() * countingObjects.length)];
  
  // Update question
  const question = document.getElementById('level3-question');
  question.textContent = 'Which side has MORE objects? Or are they EQUAL?';
  
  // Clear feedback
  const feedback = document.getElementById('level3-feedback');
  feedback.innerHTML = '';
  feedback.style.display = 'none';
  
  // Clear choice buttons
  const choiceButtons = document.querySelectorAll('.choice-btn');
  choiceButtons.forEach(btn => {
    btn.style.pointerEvents = 'auto';
    btn.style.background = '';
    btn.style.color = '';
  });
  
  // Render left group
  const leftGroup = document.getElementById('group-left');
  leftGroup.innerHTML = '';
  for (let i = 0; i < level3LeftCount; i++) {
    const obj = document.createElement('span');
    obj.textContent = level3ObjectLeft;
    obj.className = 'comparison-object';
    leftGroup.appendChild(obj);
  }
  
  // Render right group
  const rightGroup = document.getElementById('group-right');
  rightGroup.innerHTML = '';
  for (let i = 0; i < level3RightCount; i++) {
    const obj = document.createElement('span');
    obj.textContent = level3ObjectRight;
    obj.className = 'comparison-object';
    rightGroup.appendChild(obj);
  }
  
  speakText(`Compare the two groups. Which has more objects, or are they equal?`);
}

function handleLevel3Answer(choice) {
  if (!gameUnlocked) return;
  
  const choiceButtons = document.querySelectorAll('.choice-btn');
  choiceButtons.forEach(btn => btn.style.pointerEvents = 'none');
  
  let isCorrect = false;
  let correctChoice = '';
  
  if (level3LeftCount > level3RightCount) {
    isCorrect = choice === 'left';
    correctChoice = 'left';
  } else if (level3RightCount > level3LeftCount) {
    isCorrect = choice === 'right';
    correctChoice = 'right';
  } else {
    isCorrect = choice === 'equal';
    correctChoice = 'equal';
  }
  
  const feedback = document.getElementById('level3-feedback');
  
  if (isCorrect) {
    countingScore += 10;
    document.getElementById('count-score').textContent = countingScore;
    
    if (countingScore % 50 === 0) {
      countingLevel++;
      document.getElementById('count-level').textContent = countingLevel;
    }
    
    feedback.innerHTML = '✅ Correct! Great comparison!';
    feedback.style.color = '#28a745';
    
    speakText('Correct! Great job comparing!');
    
    // Highlight the correct choice
    choiceButtons.forEach(btn => {
      if (btn.getAttribute('data-choice') === correctChoice) {
        btn.style.background = '#28a745';
        btn.style.color = 'white';
      }
    });
  } else {
    feedback.innerHTML = '❌ Not quite. Try again!';
    feedback.style.color = '#dc3545';
    
    speakText('Try again!');
    
    // Highlight correct and wrong choices
    choiceButtons.forEach(btn => {
      const btnChoice = btn.getAttribute('data-choice');
      if (btnChoice === correctChoice) {
        btn.style.background = '#28a745';
        btn.style.color = 'white';
      } else if (btnChoice === choice) {
        btn.style.background = '#dc3545';
        btn.style.color = 'white';
      }
    });
    
    // Re-enable after showing feedback
    setTimeout(() => {
      choiceButtons.forEach(btn => btn.style.pointerEvents = 'auto');
    }, 1500);
    return;
  }
  
  feedback.style.display = 'block';
}

// Save progress to localStorage
function saveCountingProgress() {
  const progressData = {
    score: countingScore,
    level: countingLevel,
    lastPlayed: new Date().toISOString()
  };
  localStorage.setItem('countObjectsProgress', JSON.stringify(progressData));
}

// Load progress from localStorage
function loadCountingProgress() {
  const saved = localStorage.getItem('countObjectsProgress');
  if (saved) {
    try {
      const progressData = JSON.parse(saved);
      countingScore = progressData.score || 0;
      countingLevel = progressData.level || 1;
      
      // Update display
      const scoreElement = document.getElementById('count-score');
      const levelElement = document.getElementById('count-level');
      if (scoreElement) scoreElement.textContent = countingScore;
      if (levelElement) levelElement.textContent = countingLevel;
    } catch (e) {
      console.log('Could not load count objects game progress');
    }
  }
}

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', function() {
  // Load saved progress
  loadCountingProgress();
  
  // Set up event listeners for Level 1
  const newQuestionBtn = document.getElementById('new-count-question');
  const hearCountBtn = document.getElementById('hear-count');
  
  if (newQuestionBtn) {
    newQuestionBtn.addEventListener('click', generateCountingQuestion);
  }
  
  if (hearCountBtn) {
    hearCountBtn.addEventListener('click', hearCount);
  }
  
  // Set up event listeners for Level 2
  const newLevel2Btn = document.getElementById('new-level2-question');
  const level2HelpBtn = document.getElementById('level2-help');
  
  if (newLevel2Btn) {
    newLevel2Btn.addEventListener('click', () => {
      resetLevel2();
      generateLevel2Question();
    });
  }
  
  if (level2HelpBtn) {
    level2HelpBtn.addEventListener('click', () => {
      speakText(`Click exactly ${level2TargetNumber} objects`);
    });
  }
  
  // Set up event listeners for Level 3
  const newLevel3Btn = document.getElementById('new-level3-question');
  const level3ChoiceButtons = document.querySelectorAll('.choice-btn');
  
  if (newLevel3Btn) {
    newLevel3Btn.addEventListener('click', generateLevel3Question);
  }
  
  level3ChoiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-choice');
      handleLevel3Answer(choice);
    });
  });
  
  // Set up level selector buttons
  const levelButtons = document.querySelectorAll('.level-btn');
  levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const level = Number(btn.getAttribute('data-level'));
      switchCountingLevel(level);
    });
  });

  const guideStartBtn = document.getElementById('guide-start');
  const openGuideBtn = document.getElementById('open-guide');

  if (guideStartBtn) {
    guideStartBtn.addEventListener('click', hideGuideAndStart);
  }

  if (openGuideBtn) {
    openGuideBtn.addEventListener('click', showGuide);
  }
  
  // Show guide first; start game after confirmation
  showGuide();
  
  // Save progress periodically
  setInterval(saveCountingProgress, 5000);
});

// Save progress when leaving the page
window.addEventListener('beforeunload', saveCountingProgress);

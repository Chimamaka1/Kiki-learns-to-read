// Counting Game Logic
let currentCountingAnswer = 0;
let countingScore = 0;
let countingLevel = 1;
const countingObjects = ['🍎', '⭐', '🎈', '🦋', '🌸', '🎁', '🐸', '⚽', '🍕', '🚗'];

// Navigation function
function goBack() {
  window.history.back();
}

function generateCountingQuestion() {
  // Generate a number between 1 and Math.min(10, level + 4)
  const maxCount = Math.min(10, countingLevel + 4);
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
    const choice = Math.floor(Math.random() * Math.min(10, countingLevel + 4)) + 1;
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
    const scoreElement = document.getElementById('counting-score');
    if (scoreElement) scoreElement.textContent = countingScore;
    
    // Level up every 50 points
    if (countingScore % 50 === 0) {
      countingLevel++;
      const levelElement = document.getElementById('counting-level');
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
    }, 2000);
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
  const objectText = currentCountingAnswer === 1 ? 'object' : 'objects';
  speakText(`Count the objects. There are ${currentCountingAnswer} ${objectText}.`);
}

// Save progress to localStorage
function saveCountingProgress() {
  const progressData = {
    score: countingScore,
    level: countingLevel,
    lastPlayed: new Date().toISOString()
  };
  localStorage.setItem('countingGameProgress', JSON.stringify(progressData));
}

// Load progress from localStorage
function loadCountingProgress() {
  const saved = localStorage.getItem('countingGameProgress');
  if (saved) {
    try {
      const progressData = JSON.parse(saved);
      countingScore = progressData.score || 0;
      countingLevel = progressData.level || 1;
      
      // Update display
      const scoreElement = document.getElementById('counting-score');
      const levelElement = document.getElementById('counting-level');
      if (scoreElement) scoreElement.textContent = countingScore;
      if (levelElement) levelElement.textContent = countingLevel;
    } catch (e) {
      console.log('Could not load counting game progress');
    }
  }
}

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', function() {
  // Load saved progress
  loadCountingProgress();
  
  // Set up event listeners
  const newQuestionBtn = document.getElementById('new-counting-question');
  const hearCountBtn = document.getElementById('hear-count');
  
  if (newQuestionBtn) {
    newQuestionBtn.addEventListener('click', generateCountingQuestion);
  }
  
  if (hearCountBtn) {
    hearCountBtn.addEventListener('click', hearCount);
  }
  
  // Generate initial question
  generateCountingQuestion();
  
  // Save progress periodically
  setInterval(saveCountingProgress, 5000);
});

// Save progress when leaving the page
window.addEventListener('beforeunload', saveCountingProgress);
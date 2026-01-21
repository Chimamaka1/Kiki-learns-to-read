// Number Balloon Pop Game Logic
let currentNumberToFind = 0;
let balloonScore = 0;
let balloonLevel = 1;
let questionData = {}; // Stores question type and data

// Balloon colors
const balloonColors = ['balloon-red', 'balloon-blue', 'balloon-yellow', 'balloon-green', 'balloon-purple', 'balloon-pink', 'balloon-orange', 'balloon-cyan'];

// Local speech helper
const speechReady = typeof window !== 'undefined' && 'speechSynthesis' in window;
function speakText(text) {
  if (!speechReady) return;
  try {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech error:', e);
  }
}

// Navigation function
function goBack() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#numbers-section';
}

function setLevel(newLevel) {
  balloonLevel = newLevel;
  const levelLabel = document.getElementById('balloon-level');
  if (levelLabel) levelLabel.textContent = balloonLevel;

  // Highlight the active level button
  const levelButtons = document.querySelectorAll('.level-button');
  levelButtons.forEach(btn => {
    const btnLevel = Number(btn.dataset.level);
    btn.classList.toggle('active', btnLevel === balloonLevel);
  });

  generateBalloonQuestion();
}

function generateBalloonQuestion() {
  const instructionElement = document.getElementById('number-to-pop');
  
  // Level 1: Basic numbers 1-10
  if (balloonLevel === 1) {
    currentNumberToFind = Math.floor(Math.random() * 10) + 1;
    if (instructionElement) {
      instructionElement.textContent = 'Listen to the number and pop the balloon with the number';
    }
    setTimeout(() => speakText(currentNumberToFind), 200);
    questionData = { type: 'basic', answer: currentNumberToFind };
  }
  
  // Level 2: Larger range 1-20
  else if (balloonLevel === 2) {
    currentNumberToFind = Math.floor(Math.random() * 20) + 1;
    if (instructionElement) {
      instructionElement.textContent = 'Listen to the number and pop the balloon with the number';
    }
    setTimeout(() => speakText(currentNumberToFind), 200);
    questionData = { type: 'basic', answer: currentNumberToFind };
  }
  
  // Level 3: Before/After numbers
  else if (balloonLevel === 3) {
    const baseNumber = Math.floor(Math.random() * 18) + 2; // 2-19 so we can ask before/after
    const isAfter = Math.random() > 0.5;
    
    if (isAfter) {
      currentNumberToFind = baseNumber + 1;
      if (instructionElement) {
        instructionElement.textContent = `What comes AFTER ${baseNumber}?`;
      }
      setTimeout(() => speakText(`What comes after ${baseNumber}?`), 200);
    } else {
      currentNumberToFind = baseNumber - 1;
      if (instructionElement) {
        instructionElement.textContent = `What comes BEFORE ${baseNumber}?`;
      }
      setTimeout(() => speakText(`What comes before ${baseNumber}?`), 200);
    }
    questionData = { type: 'sequence', baseNumber, isAfter, answer: currentNumberToFind };
  }
  
  // Level 4: Add/Subtract with apple stories (answers up to 10)
  else if (balloonLevel === 4) {
    const useSubtraction = Math.random() > 0.5;
    let num1, num2;
    if (useSubtraction) {
      num1 = Math.floor(Math.random() * 9) + 2; // 2-10
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 to num1-1
      currentNumberToFind = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * 5) + 1; // 1-5
      num2 = Math.floor(Math.random() * (10 - num1)) + 1; // keep sum ≤ 10
      currentNumberToFind = num1 + num2;
    }
    const promptText = useSubtraction
      ? `If you have ${num1} apples and you give ${num2} to your friend, how many apples do you have left?`
      : `If you have ${num1} apples and you get ${num2} more apples, how many apples do you have now?`;
    if (instructionElement) {
      instructionElement.textContent = promptText;
    }
    setTimeout(() => speakText(promptText), 200);
    questionData = { type: 'apples', op: useSubtraction ? 'sub' : 'add', num1, num2, answer: currentNumberToFind };
  }
  else {
    // Default to level 1 logic if an unknown level is encountered
    balloonLevel = 1;
    currentNumberToFind = Math.floor(Math.random() * 10) + 1;
    if (instructionElement) {
      instructionElement.textContent = 'Listen to the number and pop the balloon with the number';
    }
    setTimeout(() => speakText(currentNumberToFind), 200);
    questionData = { type: 'basic', answer: currentNumberToFind };
  }
  
  // Display balloons
  generateBalloonGrid();
}

function generateBalloonGrid() {
  const balloonGrid = document.getElementById('balloons-grid');
  if (!balloonGrid) return;
  
  balloonGrid.innerHTML = '';
  
  // Determine number range based on level
  let maxNumber;
  if (balloonLevel === 1) maxNumber = 10;
  else if (balloonLevel === 2) maxNumber = 20;
  else if (balloonLevel === 3) maxNumber = 20;
  else if (balloonLevel === 4) maxNumber = 10; // Add/Sub answers stay ≤ 10
  else maxNumber = 50; // Skip counting can go higher
  
  // Create a set of unique numbers including the correct answer
  const numbers = new Set([currentNumberToFind]);
  
  // Add 11 more unique random numbers
  let attempts = 0;
  while (numbers.size < 12 && attempts < 100) {
    numbers.add(Math.floor(Math.random() * maxNumber) + 1);
    attempts++;
  }
  
  // If we don't have 12 numbers, fill with sequential ones
  let filler = 1;
  while (numbers.size < 12) {
    if (!numbers.has(filler)) numbers.add(filler);
    filler++;
  }
  
  // Convert to array and shuffle
  const balloonsArray = Array.from(numbers).sort(() => Math.random() - 0.5);
  
  // Create balloon elements
  balloonsArray.forEach((number, index) => {
    const balloonDiv = document.createElement('div');
    balloonDiv.className = 'balloon';
    balloonDiv.dataset.number = number;
    
    // Stagger fade-in animation
    balloonDiv.style.animation = `fadeIn 0.4s ease-out ${index * 0.05}s both, float 3s ease-in-out ${index * 0.2}s infinite`;
    
    // Random color
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    
    // Create balloon body
    const balloonBody = document.createElement('div');
    balloonBody.className = `balloon-body ${color}`;
    balloonBody.textContent = number;
    
    // Create balloon string
    const balloonString = document.createElement('div');
    balloonString.className = 'balloon-string';
    
    // Append elements
    balloonDiv.appendChild(balloonBody);
    balloonDiv.appendChild(balloonString);
    
    // Add click handler to the entire balloon div
    balloonDiv.addEventListener('click', function() {
      checkBalloonAnswer(number, balloonDiv);
    });
    
    balloonGrid.appendChild(balloonDiv);
  });
}

function checkBalloonAnswer(selectedNumber, balloonDiv) {
  // Prevent double-clicking
  if (balloonDiv.classList.contains('popping')) return;
  
  const isCorrect = selectedNumber === currentNumberToFind;
  
  // Disable all balloons during animation
  const allBalloons = document.querySelectorAll('.balloon');
  allBalloons.forEach(b => b.style.pointerEvents = 'none');
  
  if (isCorrect) {
    // Mark as popping
    balloonDiv.classList.add('popping');
    balloonDiv.classList.add('balloon-popped');
    
    // Update score
    balloonScore += 10;
    document.getElementById('balloon-score').textContent = balloonScore;

    // Speak success message based on question type
    let successMessage = `Correct! `;
    if (questionData.type === 'apples') {
      if (questionData.op === 'sub') {
        successMessage += `You had ${questionData.num1} apples and gave ${questionData.num2} to your friend. You have ${currentNumberToFind} apples left!`;
      } else {
        successMessage += `You had ${questionData.num1} apples and got ${questionData.num2} more. You have ${currentNumberToFind} apples now!`;
      }
    } else if (questionData.type === 'sequence') {
      successMessage += `The answer is ${currentNumberToFind}!`;
    } else {
      successMessage += `That is ${currentNumberToFind}!`;
    }
    speakText(successMessage);
    
    // Generate new question after balloon pops
    setTimeout(() => {
      generateBalloonQuestion();
    }, 700);
    
  } else {
    // Wrong answer - shake animation
    balloonDiv.style.animation = 'shake 0.4s ease-in-out';
    speakText(`Try again!`);
    
    // Re-enable balloons after shake
    setTimeout(() => {
      balloonDiv.style.animation = '';
      allBalloons.forEach(b => b.style.pointerEvents = 'auto');
    }, 400);
  }
}

function speakNumber() {
  // Repeat the current question
  if (questionData.type === 'apples') {
    if (questionData.op === 'sub') {
      speakText(`If you have ${questionData.num1} apples and you give ${questionData.num2} to your friend, how many apples do you have left?`);
    } else {
      speakText(`If you have ${questionData.num1} apples and you get ${questionData.num2} more apples, how many apples do you have now?`);
    }
  } else if (questionData.type === 'sequence') {
    const word = questionData.isAfter ? 'after' : 'before';
    speakText(`What comes ${word} ${questionData.baseNumber}?`);
  } else {
    speakText(currentNumberToFind);
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Attach speak button
  const speakBtn = document.getElementById('speak-number-btn');
  if (speakBtn) {
    speakBtn.addEventListener('click', speakNumber);
  }
  
  // Start at Level 1 by default
  setLevel(1);
});

// Add required animations
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
    20%, 40%, 60%, 80% { transform: translateX(8px); }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.3) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;
document.head.appendChild(style);

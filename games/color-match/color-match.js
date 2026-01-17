/* =========================
   COLOR MATCH - GAME LOGIC
========================= */

const colorData = [
  { name: 'Red', hex: '#ff4757' },
  { name: 'Blue', hex: '#1e90ff' },
  { name: 'Green', hex: '#2ed573' },
  { name: 'Yellow', hex: '#ffd93d' },
  { name: 'Purple', hex: '#a29bfe' },
  { name: 'Orange', hex: '#ff8c42' },
  { name: 'Pink', hex: '#ff6b9d' },
  { name: 'Cyan', hex: '#00d4ff' },
];

let score = 0;
let usedColors = new Set();
let gameActive = true;

document.addEventListener('DOMContentLoaded', function() {
  loadNewRound();
});

function loadNewRound() {
  gameActive = false;
  
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * colorData.length);
  } while (usedColors.has(randomIndex) && usedColors.size < colorData.length);
  
  if (usedColors.size >= colorData.length) {
    usedColors.clear();
  }
  
  usedColors.add(randomIndex);
  const currentColor = colorData[randomIndex];
  
  displayRound(currentColor);
}

function displayRound(colorObj) {
  document.getElementById('feedback-section').style.display = 'none';
  
  // Display target color
  const targetDiv = document.getElementById('target-color');
  targetDiv.style.backgroundColor = colorObj.hex;
  document.getElementById('color-name').textContent = colorObj.name;
  
  // Create color options - shuffle them
  const colors = [...colorData].sort(() => Math.random() - 0.5).slice(0, 4);
  
  // Make sure the correct color is in the options
  if (!colors.includes(colorObj)) {
    colors[Math.floor(Math.random() * 4)] = colorObj;
  }
  
  const buttonsDiv = document.getElementById('color-buttons');
  buttonsDiv.innerHTML = '';
  
  colors.forEach((color, index) => {
    const btn = document.createElement('button');
    btn.className = 'color-btn';
    btn.style.backgroundColor = color.hex;
    btn.onclick = () => checkAnswer(color.name, colorObj.name, btn);
    btn.style.animationDelay = `${index * 0.1}s`;
    buttonsDiv.appendChild(btn);
  });
  
  setTimeout(() => {
    gameActive = true;
    const buttons = document.querySelectorAll('.color-btn');
    buttons.forEach(btn => btn.disabled = false);
  }, 400);
}

function checkAnswer(selectedColor, correctColor, btnElement) {
  if (!gameActive) return;
  gameActive = false;
  
  const feedbackDiv = document.getElementById('feedback-section');
  const messageDiv = document.getElementById('feedback-message');
  const buttons = document.querySelectorAll('.color-btn');
  
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.add('disabled');
  });
  
  if (selectedColor === correctColor) {
    messageDiv.textContent = '🎉 Great! You matched the colors!';
    messageDiv.className = 'feedback-message correct';
    score += 10;
    updateScore();
    playCorrectSound();
    celebrateSuccess();
  } else {
    messageDiv.textContent = `❌ Oops! That's ${selectedColor}. Try again!`;
    messageDiv.className = 'feedback-message incorrect';
    playIncorrectSound();
  }
  
  feedbackDiv.style.display = 'block';
}

function nextRound() {
  loadNewRound();
}

function updateScore() {
  document.getElementById('score').textContent = score;
}

async function playCorrectSound() {
  const synth = window.speechSynthesis;
  if (synth) {
    const utterance = new SpeechSynthesisUtterance('Perfect!');
    utterance.rate = 0.8;
    utterance.pitch = 1.3;
    synth.speak(utterance);
  }
}

async function playIncorrectSound() {
  const synth = window.speechSynthesis;
  if (synth) {
    const utterance = new SpeechSynthesisUtterance('Try again');
    utterance.rate = 0.8;
    synth.speak(utterance);
  }
}

function celebrateSuccess() {
  const celebration = document.getElementById('celebration');
  celebration.style.display = 'block';
  
  const colors = ['#ff4757', '#1e90ff', '#2ed573', '#ffd93d', '#a29bfe', '#ff8c42'];
  
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.delay = Math.random() * 0.5 + 's';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    celebration.appendChild(confetti);
  }
  
  setTimeout(() => {
    celebration.innerHTML = '';
    celebration.style.display = 'none';
  }, 3500);
}

function goBack() {
  window.history.back();
}

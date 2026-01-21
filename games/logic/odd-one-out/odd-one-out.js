/* =========================
   ODD ONE OUT - GAME LOGIC
========================= */

const oddOneOutData = {
  easy: [
    { items: ['🔴', '🔴', '🔴', '🔵'], oddIndex: 3, oddName: 'Blue circle', sameName: 'Red circle' },
    { items: ['🐕', '🐕', '🐕', '🐈'], oddIndex: 3, oddName: 'Cat', sameName: 'Dog' },
    { items: ['🍎', '🍎', '🍎', '🍊'], oddIndex: 3, oddName: 'Orange', sameName: 'Apple' },
    { items: ['⭐', '⭐', '⭐', '🌙'], oddIndex: 3, oddName: 'Moon', sameName: 'Star' },
    { items: ['🎈', '🎈', '🎈', '🎁'], oddIndex: 3, oddName: 'Gift', sameName: 'Balloon' },
    { items: ['🟢', '🟢', '🟢', '🟡'], oddIndex: 3, oddName: 'Yellow circle', sameName: 'Green circle' },
    { items: ['🌸', '🌸', '🌸', '🦋'], oddIndex: 3, oddName: 'Butterfly', sameName: 'Flower' },
    { items: ['🏠', '🏠', '🏠', '🚗'], oddIndex: 3, oddName: 'Car', sameName: 'House' },
  ],
  medium: [
    { items: ['🔴', '🔴', '🔵', '🔴'], oddIndex: 2, oddName: 'Blue circle', sameName: 'Red circle' },
    { items: ['🐕', '🐕', '🐈', '🐕'], oddIndex: 2, oddName: 'Cat', sameName: 'Dog' },
    { items: ['🍎', '🍎', '🍊', '🍎'], oddIndex: 2, oddName: 'Orange', sameName: 'Apple' },
    { items: ['⭐', '⭐', '🌙', '⭐'], oddIndex: 2, oddName: 'Moon', sameName: 'Star' },
    { items: ['🎈', '🎈', '🎁', '🎈'], oddIndex: 2, oddName: 'Gift', sameName: 'Balloon' },
    { items: ['💚', '💚', '💙', '💚'], oddIndex: 2, oddName: 'Blue heart', sameName: 'Green heart' },
    { items: ['🎮', '🎮', '🎲', '🎮'], oddIndex: 2, oddName: 'Dice', sameName: 'Game controller' },
    { items: ['🍕', '🍕', '🍔', '🍕'], oddIndex: 2, oddName: 'Hamburger', sameName: 'Pizza' },
    { items: ['🚗', '🚗', '🚕', '🚗'], oddIndex: 2, oddName: 'Taxi', sameName: 'Car' },
    { items: ['🎸', '🎸', '🎹', '🎸'], oddIndex: 2, oddName: 'Piano', sameName: 'Guitar' },
  ],
  hard: [
    { items: ['🔴', '🔵', '🔴', '🔴'], oddIndex: 1, oddName: 'Blue circle', sameName: 'Red circle' },
    { items: ['🐕', '🐈', '🐕', '🐕'], oddIndex: 1, oddName: 'Cat', sameName: 'Dog' },
    { items: ['🍎', '🍊', '🍎', '🍎'], oddIndex: 1, oddName: 'Orange', sameName: 'Apple' },
    { items: ['⭐', '🌙', '⭐', '⭐'], oddIndex: 1, oddName: 'Moon', sameName: 'Star' },
    { items: ['🎈', '🎁', '🎈', '🎈'], oddIndex: 1, oddName: 'Gift', sameName: 'Balloon' },
    { items: ['💚', '💙', '💚', '💚'], oddIndex: 1, oddName: 'Blue heart', sameName: 'Green heart' },
    { items: ['🎮', '🎲', '🎮', '🎮'], oddIndex: 1, oddName: 'Dice', sameName: 'Game controller' },
    { items: ['🍕', '🍔', '🍕', '🍕'], oddIndex: 1, oddName: 'Hamburger', sameName: 'Pizza' },
    { items: ['🚗', '🚕', '🚗', '🚗'], oddIndex: 1, oddName: 'Taxi', sameName: 'Car' },
    { items: ['🎸', '🎹', '🎸', '🎸'], oddIndex: 1, oddName: 'Piano', sameName: 'Guitar' },
    { items: ['🌸', '🌺', '🌸', '🌸'], oddIndex: 1, oddName: 'Rose', sameName: 'Daisy' },
    { items: ['📚', '📖', '📚', '📚'], oddIndex: 1, oddName: 'Open book', sameName: 'Closed book' },
  ]
};

let currentDifficulty = 'easy';
let score = 0;
let usedRounds = new Set();
let gameActive = true;

document.addEventListener('DOMContentLoaded', function() {
  setupDifficultyButtons();
  loadNewRound();
});

function setupDifficultyButtons() {
  const buttons = document.querySelectorAll('.difficulty-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      buttons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentDifficulty = this.dataset.difficulty;
      score = 0;
      usedRounds.clear();
      updateScore();
      loadNewRound();
    });
  });
}

function loadNewRound() {
  const data = oddOneOutData[currentDifficulty];
  
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * data.length);
  } while (usedRounds.has(randomIndex) && usedRounds.size < data.length);
  
  if (usedRounds.size >= data.length) {
    usedRounds.clear();
  }
  
  usedRounds.add(randomIndex);
  const currentRound = data[randomIndex];
  
  displayRound(currentRound);
}

function displayRound(roundData) {
  gameActive = false;
  
  const grid = document.getElementById('items-grid');
  grid.innerHTML = '';
  
  roundData.items.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = 'item-button';
    btn.textContent = item;
    btn.onclick = () => checkAnswer(index, roundData.oddIndex, btn);
    btn.style.animationDelay = `${index * 0.1}s`;
    grid.appendChild(btn);
  });
  
  document.getElementById('feedback-section').style.display = 'none';
  
  setTimeout(() => {
    gameActive = true;
    const buttons = document.querySelectorAll('.item-button');
    buttons.forEach(btn => btn.disabled = false);
  }, roundData.items.length * 100);
}

function checkAnswer(selectedIndex, correctIndex, btnElement) {
  if (!gameActive) return;
  gameActive = false;
  
  const feedbackDiv = document.getElementById('feedback-section');
  const messageDiv = document.getElementById('feedback-message');
  const buttons = document.querySelectorAll('.item-button');
  
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.add('disabled');
  });
  
  if (selectedIndex === correctIndex) {
    messageDiv.textContent = '🎉 Perfect! You found the odd one out!';
    messageDiv.className = 'feedback-message correct';
    score += 10;
    updateScore();
    playCorrectSound();
    celebrateSuccess();
  } else {
    messageDiv.textContent = `❌ Oops! That one was the same. Try again!`;
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
    const utterance = new SpeechSynthesisUtterance('Correct!');
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
  
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.delay = Math.random() * 0.5 + 's';
    confetti.style.background = ['#f093fb', '#f5576c', '#ff6b9d', '#c44569'][Math.floor(Math.random() * 4)];
    celebration.appendChild(confetti);
  }
  
  setTimeout(() => {
    celebration.innerHTML = '';
    celebration.style.display = 'none';
  }, 3500);
}

function goBack() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#logic-section';
}

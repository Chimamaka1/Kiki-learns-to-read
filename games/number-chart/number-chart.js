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
  window.history.back();
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

  // Initialize Number Chart
  renderRangeSelector();
  renderNumberGrid(currentRange.start, currentRange.end);
});


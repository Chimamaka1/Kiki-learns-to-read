// Word Spinner – Roll letters to make word families

// Word families with valid starting consonants
const wordFamilies = {
  'at': ['b', 'c', 'f', 'h', 'm', 'p', 'r', 's', 'v'],
  'an': ['c', 'f', 'm', 'p', 'r', 't', 'v'],
  'ap': ['c', 'g', 'l', 'm', 'n', 's', 't', 'z'],
  'ag': ['b', 'g', 'l', 'r', 't', 'w'],
  'ad': ['b', 'd', 'h', 'm', 'p', 's'],
  'ig': ['b', 'd', 'f', 'p', 'w'],
  'ip': ['d', 'h', 'l', 'r', 's', 't', 'z'],
  'it': ['b', 'f', 'h', 'k', 'l', 'p', 's'],
  'in': ['b', 'f', 'p', 't', 'w'],
  'og': ['d', 'f', 'h', 'j', 'l'],
  'op': ['h', 'm', 'p', 't'],
  'ot': ['c', 'd', 'g', 'h', 'l', 'n', 'p', 'r'],
  'ug': ['b', 'h', 'j', 'm', 'r', 't'],
  'un': ['b', 'f', 'r', 's'],
  'ut': ['b', 'c', 'h', 'n', 'r'],
  'ed': ['b', 'f', 'l', 'r', 'w'],
  'en': ['h', 'm', 'p', 't'],
  'et': ['g', 'j', 'n', 'p', 'v', 'w']
};

let currentFamily = 'at';
let currentLetters = wordFamilies['at'];
let currentIndex = 0;

const letterDisplay = document.getElementById('first-letter');
const endingDisplay = document.getElementById('word-ending');
const currentWordDisplay = document.getElementById('current-word');
const spinUpBtn = document.getElementById('spin-up');
const spinDownBtn = document.getElementById('spin-down');
const hearWordBtn = document.getElementById('hear-word');
const familyButtonsContainer = document.getElementById('family-buttons');
const rewardEl = document.getElementById('reward');

// Audio synthesis
const elevenLabsApiKey = window.config?.elevenLabs?.apiKey || '';
const voiceId = window.config?.elevenLabs?.voiceId || '';

function speakWord(word) {
  if (!elevenLabsApiKey || !voiceId) {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.rate = 0.8;
    utter.pitch = 1.2;
    speechSynthesis.speak(utter);
    return;
  }
  
  fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': elevenLabsApiKey
    },
    body: JSON.stringify({
      text: word,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.5, similarity_boost: 0.5 }
    })
  })
  .then(r => r.ok ? r.blob() : Promise.reject())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play().catch(() => {});
    audio.onended = () => URL.revokeObjectURL(url);
    audio.onerror = () => URL.revokeObjectURL(url);
  })
  .catch(() => {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.rate = 0.8;
    utter.pitch = 1.2;
    speechSynthesis.speak(utter);
  });
}

function updateDisplay(animate = true) {
  const letter = currentLetters[currentIndex];
  const word = letter + currentFamily;
  
  if (animate) {
    letterDisplay.classList.add('spinning');
    currentWordDisplay.style.animation = 'none';
    setTimeout(() => {
      currentWordDisplay.style.animation = 'wordPop 0.5s ease-out';
    }, 10);
    
    setTimeout(() => {
      letterDisplay.classList.remove('spinning');
    }, 500);
  }
  
  letterDisplay.textContent = letter;
  currentWordDisplay.textContent = word;
  
  // Show reward briefly
  showReward();
  
  // Auto-speak the word
  setTimeout(() => speakWord(word), 300);
}

function showReward() {
  rewardEl.classList.remove('hidden');
  setTimeout(() => rewardEl.classList.add('hidden'), 800);
}

function spinUp() {
  letterDisplay.classList.add('roll-up');
  setTimeout(() => letterDisplay.classList.remove('roll-up'), 400);
  
  currentIndex = (currentIndex - 1 + currentLetters.length) % currentLetters.length;
  setTimeout(() => updateDisplay(false), 200);
}

function spinDown() {
  letterDisplay.classList.add('roll-down');
  setTimeout(() => letterDisplay.classList.remove('roll-down'), 400);
  
  currentIndex = (currentIndex + 1) % currentLetters.length;
  setTimeout(() => updateDisplay(false), 200);
}

function setWordFamily(family) {
  currentFamily = family;
  currentLetters = wordFamilies[family];
  currentIndex = 0;
  
  endingDisplay.textContent = family;
  updateDisplay(true);
  
  // Update active button
  document.querySelectorAll('.family-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.family === family);
  });
}

function initFamilyButtons() {
  const families = Object.keys(wordFamilies);
  families.forEach(family => {
    const btn = document.createElement('button');
    btn.className = 'family-btn';
    btn.textContent = `-${family}`;
    btn.dataset.family = family;
    if (family === currentFamily) btn.classList.add('active');
    
    btn.onclick = () => setWordFamily(family);
    familyButtonsContainer.appendChild(btn);
  });
}

// Event listeners
spinUpBtn.onclick = spinUp;
spinDownBtn.onclick = spinDown;
hearWordBtn.onclick = () => speakWord(currentWordDisplay.textContent);

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') spinUp();
  if (e.key === 'ArrowDown') spinDown();
});

// Initialize
initFamilyButtons();
updateDisplay(true);

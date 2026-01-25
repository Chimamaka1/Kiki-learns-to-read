/* =========================
   SPELL IT - CVC WORD SPELLING GAME
========================= */

// CVC words with emojis for visual support
const cvcWords = [
  { word: 'cat', emoji: '🐱' },
  { word: 'dog', emoji: '🐕' },
  { word: 'bat', emoji: '🦇' },
  { word: 'hat', emoji: '🎩' },
  { word: 'mat', emoji: '🧘' },
  { word: 'rat', emoji: '🐀' },
  { word: 'pig', emoji: '🐷' },
  { word: 'sun', emoji: '☀️' },
  { word: 'run', emoji: '🏃' },
  { word: 'bug', emoji: '🐛' },
  { word: 'mug', emoji: '☕' },
  { word: 'rug', emoji: '🧶' },
  { word: 'pen', emoji: '🖊️' },
  { word: 'hen', emoji: '🐔' },
  { word: 'ten', emoji: '🔟' },
  { word: 'bed', emoji: '🛏️' },
  { word: 'red', emoji: '🔴' },
  { word: 'leg', emoji: '🦵' },
  { word: 'pot', emoji: '🍲' },
  { word: 'hot', emoji: '🔥' },
  { word: 'top', emoji: '⬆️' },
  { word: 'mop', emoji: '🧹' },
  { word: 'box', emoji: '📦' },
  { word: 'fox', emoji: '🦊' },
  { word: 'bus', emoji: '🚌' },
  { word: 'cup', emoji: '🥤' },
  { word: 'pup', emoji: '🐶' },
  { word: 'cut', emoji: '✂️' },
  { word: 'nut', emoji: '🥜' },
  { word: 'wet', emoji: '💦' },
  { word: 'net', emoji: '🎾' },
  { word: 'jet', emoji: '✈️' },
  { word: 'bit', emoji: '🍪' },
  { word: 'sit', emoji: '🪑' },
  { word: 'kit', emoji: '🧰' },
  { word: 'big', emoji: '🐘' },
  { word: 'dig', emoji: '⛏️' },
  { word: 'fig', emoji: '🍇' },
  { word: 'bag', emoji: '🎒' },
  { word: 'tag', emoji: '🏷️' },
  { word: 'log', emoji: '🪵' },
  { word: 'jog', emoji: '🏃‍♀️' },
  { word: 'hop', emoji: '🐇' },
  { word: 'map', emoji: '🗺️' },
  { word: 'nap', emoji: '😴' },
  { word: 'van', emoji: '🚐' },
  { word: 'fan', emoji: '🌀' },
  { word: 'can', emoji: '🥫' },
  { word: 'pan', emoji: '🍳' },
  { word: 'ram', emoji: '🐏' }
];

// Game state
let currentWord = null;
let currentAttempt = [];
let score = 0;
let wordsCompleted = 0;
let usedWords = [];
let letterButtons = [];

// ElevenLabs configuration
const elevenLabsApiKey = window.config?.elevenLabs?.apiKey || '';
const elevenLabsVoiceId = window.config?.elevenLabs?.voiceId || '';
const ttsCache = new Map();
let activeTtsAudio = null;

// Audio context for feedback sounds
let audioCtx = null;

// DOM elements
let letterSlotsDiv, letterBankDiv, feedbackDiv, feedbackMessage;
let listenBtn, clearBtn, checkBtn, nextBtn;
let scoreDisplay, progressFill, emojiDisplay;

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  letterSlotsDiv = document.getElementById('letter-slots');
  letterBankDiv = document.getElementById('letter-bank');
  feedbackDiv = document.getElementById('feedback');
  feedbackMessage = document.getElementById('feedback-message');
  listenBtn = document.getElementById('listen-btn');
  clearBtn = document.getElementById('clear-btn');
  checkBtn = document.getElementById('check-btn');
  nextBtn = document.getElementById('next-btn');
  scoreDisplay = document.getElementById('score');
  progressFill = document.getElementById('progress-fill');
  emojiDisplay = document.getElementById('emoji-display');

  // Event listeners
  listenBtn.addEventListener('click', speakCurrentWord);
  clearBtn.addEventListener('click', clearAttempt);
  checkBtn.addEventListener('click', checkSpelling);
  nextBtn.addEventListener('click', loadNextWord);

  // Audio unlock for iOS/mobile
  const unlock = () => {
    const ctx = ensureAudioCtx();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  document.addEventListener('pointerdown', unlock, { capture: true, once: true });

  // Start game
  loadNextWord();
});

function ensureAudioCtx() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  return audioCtx;
}

function loadNextWord() {
  // Reset UI
  feedbackDiv.classList.add('hidden');
  nextBtn.classList.add('hidden');
  checkBtn.classList.remove('hidden');
  clearBtn.classList.remove('hidden');

  // Select a new word (avoid recent repeats)
  let availableWords = cvcWords.filter(w => !usedWords.includes(w.word));
  if (availableWords.length === 0) {
    usedWords = [];
    availableWords = cvcWords;
  }

  currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
  usedWords.push(currentWord.word);
  if (usedWords.length > 10) usedWords.shift();

  // Reset attempt
  currentAttempt = [];

  // Update UI
  emojiDisplay.textContent = currentWord.emoji;
  createLetterSlots();
  createLetterBank();

  // Auto-speak the word
  setTimeout(() => speakCurrentWord(), 400);
}

function createLetterSlots() {
  letterSlotsDiv.innerHTML = '';
  for (let i = 0; i < currentWord.word.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'letter-slot';
    slot.dataset.index = i;
    letterSlotsDiv.appendChild(slot);
  }
}

function createLetterBank() {
  // Generate available letters: correct letters + random distractors
  const correctLetters = currentWord.word.split('');
  const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
  // Add 5-7 random distractor letters
  const distractorCount = 5 + Math.floor(Math.random() * 3);
  const distractors = [];
  while (distractors.length < distractorCount) {
    const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
    if (!correctLetters.includes(randomLetter) && !distractors.includes(randomLetter)) {
      distractors.push(randomLetter);
    }
  }

  // Combine and shuffle
  const bankLetters = [...correctLetters, ...distractors];
  shuffleArray(bankLetters);

  // Create buttons
  letterBankDiv.innerHTML = '';
  letterButtons = [];
  
  bankLetters.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'letter-btn';
    btn.textContent = letter;
    btn.dataset.letter = letter;
    btn.addEventListener('click', () => addLetter(letter, btn));
    letterBankDiv.appendChild(btn);
    letterButtons.push(btn);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function addLetter(letter, btn) {
  if (currentAttempt.length >= currentWord.word.length) return;
  
  currentAttempt.push(letter);
  btn.disabled = true;
  
  updateLetterSlots();
  playClickSound();
}

function updateLetterSlots() {
  const slots = letterSlotsDiv.querySelectorAll('.letter-slot');
  slots.forEach((slot, index) => {
    if (currentAttempt[index]) {
      slot.textContent = currentAttempt[index];
      slot.classList.add('filled');
    } else {
      slot.textContent = '';
      slot.classList.remove('filled', 'correct', 'incorrect');
    }
  });
}

function clearAttempt() {
  currentAttempt = [];
  updateLetterSlots();
  
  // Re-enable all letter buttons
  letterButtons.forEach(btn => {
    btn.disabled = false;
  });
  
  playClickSound();
}

function checkSpelling() {
  const userWord = currentAttempt.join('');
  const slots = letterSlotsDiv.querySelectorAll('.letter-slot');
  
  if (userWord === currentWord.word) {
    // Correct!
    slots.forEach(slot => {
      slot.classList.remove('incorrect');
      slot.classList.add('correct');
    });
    
    score += 10;
    wordsCompleted++;
    updateScore();
    
    feedbackMessage.textContent = '🎉 Perfect! You spelled it correctly!';
    feedbackDiv.classList.remove('incorrect');
    feedbackDiv.classList.add('correct');
    feedbackDiv.classList.remove('hidden');
    
    checkBtn.classList.add('hidden');
    clearBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    
    playSuccessSound();
    speakText('Great job! You spelled it correctly!');
    
  } else {
    // Incorrect
    slots.forEach(slot => {
      slot.classList.remove('correct');
      slot.classList.add('incorrect');
    });
    
    feedbackMessage.textContent = '❌ Try again! Listen carefully.';
    feedbackDiv.classList.remove('correct');
    feedbackDiv.classList.add('incorrect');
    feedbackDiv.classList.remove('hidden');
    
    playErrorSound();
    
    // Auto-clear after a moment
    setTimeout(() => {
      clearAttempt();
      feedbackDiv.classList.add('hidden');
      speakCurrentWord();
    }, 1500);
  }
}

function updateScore() {
  scoreDisplay.textContent = score;
  const progress = Math.min((wordsCompleted / 10) * 100, 100);
  progressFill.style.width = progress + '%';
}

// Audio feedback functions
function playClickSound() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

function playSuccessSound() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  
  const notes = [523, 659, 784]; // C, E, G
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime + (i * 0.12);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  });
}

function playErrorSound() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.35);
}

// Speech functions
function stopActiveTtsAudio() {
  if (activeTtsAudio) {
    try {
      activeTtsAudio.pause();
      activeTtsAudio.currentTime = 0;
    } catch (_) {}
    activeTtsAudio = null;
  }
}

function fallbackSpeak(text) {
  try {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.7;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Fallback speech unavailable:', e);
  }
}

async function speakText(text) {
  const cleanText = String(text || '').trim();
  if (!cleanText) return;

  stopActiveTtsAudio();
  if ('speechSynthesis' in window) {
    try { speechSynthesis.cancel(); } catch (_) {}
  }

  // Use ElevenLabs if credentials are present
  if (elevenLabsApiKey && elevenLabsVoiceId) {
    try {
      const cachedUrl = ttsCache.get(cleanText);
      if (cachedUrl) {
        activeTtsAudio = new Audio(cachedUrl);
        activeTtsAudio.play().catch(() => fallbackSpeak(cleanText));
        activeTtsAudio.onended = () => { activeTtsAudio = null; };
        return;
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        ttsCache.set(cleanText, audioUrl);
        activeTtsAudio = new Audio(audioUrl);
        activeTtsAudio.play().catch(() => fallbackSpeak(cleanText));
        activeTtsAudio.onended = () => { activeTtsAudio = null; };
        return;
      }
    } catch (e) {
      console.warn('ElevenLabs speech unavailable, using browser speech.', e);
    }
  }

  fallbackSpeak(cleanText);
}

function speakCurrentWord() {
  if (!currentWord) return;
  speakText(currentWord.word);
}

function goBack() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#reading-section';
}

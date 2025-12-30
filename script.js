/************************************************
 * KIKI LEARNS TO READ – UNIFIED PHONICS SCRIPT
 * Stages:
 * 1. Tap letters (segmenting)
 * 2. Finger slider blending
 * 3. Continuous blending
 ************************************************/

/* ---------- DOM ---------- */
const wordDisplay = document.getElementById("word-display");
const newWordButton = document.getElementById("new-word-button");
const blendButton = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

/* ---------- SETTINGS ---------- */
let stage = 3; 
// 1 = segmenting only
// 2 = slider blending
// 3 = continuous blending

/* ---------- WORD LIST ---------- */
const words = [
  "cat", "bat", "hat", "man",
  "sun", "fun", "log", "dog",
  "pin", "tin", "cup", "bug"
];

let currentWord = "";
let audioCache = {};
let lastSliderIndex = -1;

/* ---------- AUDIO ---------- */
function playLetterSound(letter) {
  const l = letter.toLowerCase();

  if (!audioCache[l]) {
    audioCache[l] = new Audio(`sounds_clean/${l}.mp3`);
  }

  audioCache[l].currentTime = 0;
  audioCache[l].play().catch(() => {});
}

/* ---------- SHOW NEW WORD ---------- */
function showNewWord() {
  wordDisplay.innerHTML = "";
  currentWord = words[Math.floor(Math.random() * words.length)];

  for (const letter of currentWord) {
    const span = document.createElement("span");
    span.textContent = letter.toUpperCase();
    span.dataset.letter = letter;
    span.className = "letter";

    // Stage 1: tap letters
    if (stage === 1) {
      span.onclick = () => playLetterSound(letter);
    }

    wordDisplay.appendChild(span);
  }

  // Slider setup for stages 2 & 3
  slider.min = 0;
  slider.max = currentWord.length - 1;
  slider.value = 0;
  lastSliderIndex = -1;
}

/* ---------- SLIDER BLENDING ---------- */
function handleSliderMove() {
  if (stage === 1) return;

  const index = Number(slider.value);
  const letters = document.querySelectorAll(".letter");

  if (!letters[index] || index === lastSliderIndex) return;

  letters.forEach(l => (l.style.backgroundColor = ""));
  letters[index].style.backgroundColor = "#ffd966";

  playLetterSound(letters[index].dataset.letter);
  lastSliderIndex = index;

  // Stage 2: speak whole word at end
  if (stage === 2 && index === letters.length - 1) {
    setTimeout(() => speakWord(), 400);
  }

  // Stage 3: continuous blend at end
  if (stage === 3 && index === letters.length - 1) {
    continuousBlend();
  }
}

/* ---------- CONTINUOUS BLEND ---------- */
async function continuousBlend() {
  const letters = document.querySelectorAll(".letter");

  for (let i = 0; i < letters.length; i++) {
    letters.forEach(l => (l.style.backgroundColor = ""));
    letters[i].style.backgroundColor = "#ffd966";

    playLetterSound(letters[i].dataset.letter);
    await new Promise(res => setTimeout(res, 250)); // overlap effect
  }

  setTimeout(() => speakWord(), 300);
}

/* ---------- SPEAK WHOLE WORD ---------- */
function speakWord() {
  const u = new SpeechSynthesisUtterance(currentWord);
  u.rate = 0.75;
  speechSynthesis.speak(u);
}

/* ---------- EVENTS ---------- */
newWordButton.onclick = showNewWord;

slider.addEventListener("input", handleSliderMove);
slider.addEventListener("touchstart", handleSliderMove);
slider.addEventListener("touchmove", handleSliderMove);

blendButton.onclick = () => {
  if (stage === 3) continuousBlend();
};

/* ---------- INIT ---------- */
wordDisplay.innerHTML = `<p>Click "New Word" to start!</p>`;

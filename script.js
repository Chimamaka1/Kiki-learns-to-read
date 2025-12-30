/************************************************
 * KIKI LEARNS TO READ – STABLE BLENDING SCRIPT
 * iPhone-safe, smooth, teacher-grade
 ************************************************/

/* ---------- DOM ---------- */
const wordDisplay = document.getElementById("word-display");
const newWordButton = document.getElementById("new-word-button");
const blendButton = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

/* ---------- WORD LIST ---------- */
const words = ["cat", "sun", "man", "log", "pin", "cup"];
let currentWord = "";

/* ---------- AUDIO CACHE ---------- */
const audioCache = {};

/* ---------- PLAY LETTER (SEGMENTING) ---------- */
function playLetter(letter) {
  if (!audioCache[letter]) {
    audioCache[letter] = new Audio(`sounds_clean/${letter}.mp3`);
  }
  audioCache[letter].currentTime = 0;
  audioCache[letter].play().catch(() => {});
}

/* ---------- SPEAK WORD (CONTINUOUS BLEND) ---------- */
function speakWord() {
  if (!currentWord) return;

  speechSynthesis.cancel(); // important for iOS
  const utterance = new SpeechSynthesisUtterance(currentWord);
  utterance.rate = 0.6;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  speechSynthesis.speak(utterance);
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

    // Tap-to-hear (segmenting stage)
    span.addEventListener("click", () => playLetter(letter));

    wordDisplay.appendChild(span);
  }

  // Reset slider (visual tracking only)
  slider.min = 0;
  slider.max = currentWord.length;
  slider.value = 0;
}

/* ---------- SLIDER = VISUAL FINGER TRACKING ---------- */
slider.addEventListener("input", () => {
  const letters = document.querySelectorAll(".letter");
  const progress = Number(slider.value);

  letters.forEach((l, i) => {
    l.style.backgroundColor = i < progress ? "#ffe599" : "";
  });
});

/* ---------- BLEND WORD BUTTON ---------- */
blendButton.addEventListener("click", () => {
  if (!currentWord) return;

  const letters = document.querySelectorAll(".letter");
  let index = 0;

  const highlightTimer = setInterval(() => {
    letters.forEach(l => (l.style.backgroundColor = ""));
    if (letters[index]) {
      letters[index].style.backgroundColor = "#ffd966";
      index++;
    } else {
      clearInterval(highlightTimer);
      setTimeout(speakWord, 200);
    }
  }, 350);
});

/* ---------- EVENTS ---------- */
newWordButton.addEventListener("click", showNewWord);

/* ---------- INIT ---------- */
wordDisplay.innerHTML = `<p>Click "New Word" to start!</p>`;

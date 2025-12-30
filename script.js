/************************************************
 * KIKI LEARNS TO READ – SMOOTH PHONICS SCRIPT
 * Calm, non-jumpy, teacher-grade behaviour
 ************************************************/

/* ---------- DOM ---------- */
const wordDisplay = document.getElementById("word-display");
const newWordButton = document.getElementById("new-word-button");
const blendButton = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

/* ---------- WORDS ---------- */
const words = ["cat", "man", "sun", "log", "pin", "cup"];
let currentWord = "";

/* ---------- AUDIO CACHE ---------- */
const audioCache = {};

/* ---------- PLAY LETTER (SEGMENTING ONLY) ---------- */
function playLetter(letter) {
  if (!audioCache[letter]) {
    audioCache[letter] = new Audio(`sounds_clean/${letter}.mp3`);
  }
  audioCache[letter].currentTime = 0;
  audioCache[letter].play().catch(() => {});
}

/* ---------- SPEAK WORD (CONTINUOUS BLEND) ---------- */
function speakWordSmooth() {
  const utterance = new SpeechSynthesisUtterance(currentWord);
  utterance.rate = 0.6;      // slower = smoother
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

/* ---------- SHOW WORD ---------- */
function showNewWord() {
  wordDisplay.innerHTML = "";
  currentWord = words[Math.floor(Math.random() * words.length)];

  for (const letter of currentWord) {
    const span = document.createElement("span");
    span.textContent = letter.toUpperCase();
    span.dataset.letter = letter;
    span.className = "letter";

    // Tap-to-hear (segmenting)
    span.onclick = () => playLetter(letter);

    wordDisplay.appendChild(span);
  }

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

/* ---------- BLEND BUTTON = TRUE CONTINUOUS BLEND ---------- */
blendButton.onclick = () => {
  const letters = document.querySelectorAll(".letter");
  let i = 0;

  const highlightInterval = setInterval(() => {
    letters.forEach(l => (l.style.backgroundColor = ""));
    if (letters[i]) letters[i].style.backgroundColor = "#ffd966";
    i++;
    if (i >= letters.length) {
      clearInterval(highlightInterval);
      setTimeout(speakWordSmooth, 200);
    }
  }, 350);
};

/* ---------- EVENTS ---------- */
newWordButton.onclick = showNewWord;

/* ---------- INIT ---------- */
wordDisplay.innerHTML = `<p>Click "New Word" to start!</p>`;

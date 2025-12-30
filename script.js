// ===============================
// CVC PHONICS TRAINER – FULL JS
// ===============================

// ----- DOM ELEMENTS -----
const wordDisplay = document.getElementById("word-display");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

// ----- WORD LIST (EXPANDABLE) -----
const words = [
  "cat", "dog", "sun", "hat", "man", "pen", "pig", "bed",
  "dig", "cup", "run", "map", "log", "tap", "sit", "fan",
  "bat", "top", "jam", "red", "hen", "lip", "box", "fox"
];

// ----- STATE -----
let currentWord = "";
let lastSliderValue = 0;

// ----- AUDIO -----
function playLetter(letter) {
  const audio = new Audio(`sounds_clean/${letter}.mp3`);
  audio.play().catch(() => {});
}

// Whole word (speech synthesis)
function speakWholeWord(word) {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = 0.6;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

// ----- DISPLAY WORD -----
function showNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  wordDisplay.innerHTML = "";

  currentWord.split("").forEach(letter => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = letter;

    span.addEventListener("click", () => {
      playLetter(letter);
    });

    wordDisplay.appendChild(span);
  });

  // Reset slider
  slider.value = 0;
  slider.max = currentWord.length;
  lastSliderValue = 0;
}

// ----- SLIDER BLENDING (FINGER SLIDE) -----
slider.addEventListener("input", () => {
  const letters = document.querySelectorAll(".letter");
  const value = Number(slider.value);

  letters.forEach((l, i) => {
    l.style.backgroundColor = i < value ? "#ffe599" : "";
  });

  // Only play sound when moving forward
  if (value > lastSliderValue && letters[value - 1]) {
    const letter = letters[value - 1].textContent.toLowerCase();
    playLetter(letter);
  }

  lastSliderValue = value;
});

// ----- BUTTON BLEND (STEP-BY-STEP → WHOLE WORD) -----
blendBtn.addEventListener("click", () => {
  const letters = document.querySelectorAll(".letter");
  let i = 0;

  const interval = setInterval(() => {
    letters.forEach(l => (l.style.backgroundColor = ""));

    if (letters[i]) {
      letters[i].style.backgroundColor = "#ffd966";
      playLetter(letters[i].textContent.toLowerCase());
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => speakWholeWord(currentWord), 300);
    }
  }, 350);
});

// ----- NEW WORD BUTTON -----
newWordBtn.addEventListener("click", showNewWord);

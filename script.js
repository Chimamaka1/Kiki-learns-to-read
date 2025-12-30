/**********************
 * DOM ELEMENTS
 **********************/
const wordDisplay = document.getElementById("word-display");
const newWordButton = document.getElementById("new-word-button");
const blendButton = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

/**********************
 * WORD LIST (CVC)
 **********************/
const words = [
  "cat", "bat", "hat", "mat",
  "dog", "log", "fog", "pig",
  "pin", "tin", "cup", "sun"
];

let currentWord = "";
let audioCache = {};
let lastSliderIndex = -1;

/**********************
 * AUDIO: PLAY LETTER
 **********************/
function playLetterSound(letter) {
  const l = letter.toLowerCase();

  if (!audioCache[l]) {
    audioCache[l] = new Audio(`sounds_clean/${l}.mp3`);
  }

  audioCache[l].currentTime = 0;
  audioCache[l].play().catch(() => {});
}

/**********************
 * SHOW NEW WORD
 **********************/
function showNewWord() {
  wordDisplay.innerHTML = "";
  currentWord = words[Math.floor(Math.random() * words.length)];

  for (const letter of currentWord) {
    const span = document.createElement("span");
    span.textContent = letter.toUpperCase();
    span.dataset.letter = letter;
    span.className = "letter";

    // Tap letter to hear sound
    span.addEventListener("click", () => {
      playLetterSound(letter);
    });

    wordDisplay.appendChild(span);
  }

  // Reset slider
  slider.min = 0;
  slider.max = currentWord.length - 1;
  slider.value = 0;
  lastSliderIndex = -1;
}

/**********************
 * SLIDER = FINGER BLENDING
 **********************/
function handleSliderMove() {
  const index = Number(slider.value);
  const letters = document.querySelectorAll(".letter");

  if (!letters[index] || index === lastSliderIndex) return;

  // Clear highlights
  letters.forEach(l => (l.style.backgroundColor = ""));

  // Highlight current letter
  letters[index].style.backgroundColor = "#ffd966";

  // Play sound
  playLetterSound(letters[index].dataset.letter);

  lastSliderIndex = index;

  // If last letter → speak whole word
  if (index === letters.length - 1) {
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(currentWord);
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }, 500);
  }
}

/**********************
 * EVENT LISTENERS
 **********************/
slider.addEventListener("input", handleSliderMove);
slider.addEventListener("touchstart", handleSliderMove);
slider.addEventListener("touchmove", handleSliderMove);

newWordButton.addEventListener("click", showNewWord);

// Optional: focus slider when Blend Word pressed
blendButton.addEventListener("click", () => {
  slider.focus();
});

/**********************
 * INITIAL STATE
 **********************/
wordDisplay.innerHTML = `<p>Click "New Word" to start!</p>`;

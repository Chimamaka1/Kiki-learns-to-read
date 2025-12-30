/* DOM */
const wordDisplay = document.getElementById("word-display");
const newWordButton = document.getElementById("new-word-button");
const blendButton = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

/* WORD LIST */
const words = ["cat", "bat", "dog", "log", "pin", "cup"];

let currentWord = "";
let audioCache = {};
let lastSliderValue = -1;

/* PLAY LETTER */
function playLetter(letter) {
  const l = letter.toLowerCase();
  if (!audioCache[l]) {
    audioCache[l] = new Audio(`sounds_clean/${l}.mp3`);
  }
  audioCache[l].currentTime = 0;
  audioCache[l].play();
}

/* SHOW NEW WORD */
function showNewWord() {
  wordDisplay.innerHTML = "";
  currentWord = words[Math.floor(Math.random() * words.length)];

  for (const letter of currentWord) {
    const span = document.createElement("span");
    span.textContent = letter.toUpperCase();
    span.dataset.letter = letter;
    span.className = "letter";
    wordDisplay.appendChild(span);
  }

  // Reset slider
  slider.max = currentWord.length - 1;
  slider.value = 0;
  lastSliderValue = -1;
}

/* SLIDER MOVE = FINGER UNDER WORD */
slider.addEventListener("input", () => {
  const index = Number(slider.value);
  const letters = document.querySelectorAll(".letter");

  if (index === lastSliderValue) return;

  letters.forEach(l => (l.style.backgroundColor = ""));
  letters[index].style.backgroundColor = "#ffd966";

  playLetter(letters[index].dataset.letter);
  lastSliderValue = index;

  // If at end, say whole word
  if (index === letters.length - 1) {
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(currentWord);
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }, 500);
  }
});

/* BUTTON EVENTS */
newWordButton.onclick = showNewWord;
blendButton.onclick = () => slider.focus();

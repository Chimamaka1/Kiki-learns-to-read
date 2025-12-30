console.log("SCRIPT LOADED");

/* DOM */
const wordDisplay = document.getElementById("word-display");
const newWordButton = document.getElementById("new-word-button");

/* WORD LIST */
const words = [
  "cat", "bat", "hat",
  "dog", "log", "fog",
  "pin", "tin", "win",
  "cup", "bug", "rug"
];

/* AUDIO CACHE */
const audioCache = {};

/* PLAY SOUND */
function playSound(letter) {
  const l = letter.toLowerCase();
  const path = `Sounds_clean/${l}.mp3`;

  if (!audioCache[l]) {
    audioCache[l] = new Audio(path);
  }

  audioCache[l].currentTime = 0;
  audioCache[l].play().catch(err => console.log(err));
}

/* LETTER CLICK */
function letterClick(e) {
  playSound(e.target.dataset.letter);
}

/* NEW WORD */
function showNewWord() {
  console.log("BUTTON CLICKED");

  wordDisplay.innerHTML = "";
  const word = words[Math.floor(Math.random() * words.length)];

  for (const letter of word) {
    const span = document.createElement("span");
    span.textContent = letter.toUpperCase();
    span.dataset.letter = letter;
    span.className = "letter";
    span.onclick = letterClick;
    wordDisplay.appendChild(span);
  }
}

/* EVENT */
newWordButton.onclick = showNewWord;

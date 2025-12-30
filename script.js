console.log("SCRIPT LOADED");

/* DOM */
const wordDisplay = document.getElementById("word-display");
const newWordButton = document.getElementById("new-word-button");
const blendButton = document.getElementById("blend-word-button");

/* WORD LIST */
const words = [
  "cat", "bat", "hat",
  "dog", "log", "fog",
  "pin", "tin", "win",
  "cup", "bug", "rug"
];

let currentWord = "";

/* AUDIO CACHE */
const audioCache = {};

/* PLAY LETTER SOUND */
function playLetter(letter) {
  const l = letter.toLowerCase();
  if (!audioCache[l]) {
    audioCache[l] = new Audio(`sounds_clean/${l}.mp3`);
  }
  audioCache[l].currentTime = 0;
  return audioCache[l].play();
}

/* LETTER CLICK */
function letterClick(e) {
  playLetter(e.target.dataset.letter);
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
    span.onclick = letterClick;
    wordDisplay.appendChild(span);
  }
}

/* BLEND WORD */
async function blendWord() {
  if (!currentWord) return;

  // play letters slowly
  for (const letter of currentWord) {
    await playLetter(letter);
    await new Promise(res => setTimeout(res, 400));
  }

  // short pause before full word
  await new Promise(res => setTimeout(res, 500));

  // spell whole word using browser voice (temporary, works instantly)
  const utterance = new SpeechSynthesisUtterance(currentWord);
  utterance.rate = 0.7;
  speechSynthesis.speak(utterance);
}

/* EVENTS */
newWordButton.onclick = showNewWord;
blendButton.onclick = blendWord;

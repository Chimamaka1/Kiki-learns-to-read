// ===============================
// CVC PHONICS TRAINER – STABLE FIX
// ===============================

// ----- DOM -----
const wordDisplay = document.getElementById("word-display");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

// ----- WORD LIST -----
const words = [
  "cat","bat","rat","mat","sat","hat","map","jam","cap","lap",
  "bed","red","pen","hen","net","jet","pet","leg",
  "sit","pit","hit","bit","fit","kit","dig","pig","wig",
  "dog","log","fog","hot","pot","top","box","fox",
  "sun","fun","run","bun","hug","bug","cup","cut","nut"
];

// ----- STATE -----
let currentWord = "";
let lastSliderValue = 0;

// ----- AUDIO -----
function playLetter(letter) {
  const audio = new Audio(`sounds_clean/${letter}.mp3`);
  audio.play().catch(() => {});
}

function speakWholeWord(word) {
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(word);
  utter.rate = 0.55; // slower, child-friendly
  speechSynthesis.speak(utter);
}

// ----- FORCE TILE RENDER -----
function renderWord(word) {
  wordDisplay.innerHTML = ""; // removes <p> text completely

  word.split("").forEach(letter => {
    const tile = document.createElement("span");
    tile.className = "letter";
    tile.textContent = letter;

    tile.addEventListener("click", () => playLetter(letter));

    wordDisplay.appendChild(tile);
  });

  slider.value = 0;
  slider.max = word.length;
  lastSliderValue = 0;
}

// ----- NEW WORD -----
function newWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
}

newWordBtn.addEventListener("click", newWord);

// 🔑 IMPORTANT: render first word on load
newWord();

// ----- SLIDER BLENDING -----
slider.addEventListener("input", () => {
  const tiles = document.querySelectorAll(".letter");
  const value = Number(slider.value);

  tiles.forEach((t, i) => {
    t.style.backgroundColor = i < value ? "#ffe599" : "#e6f2ff";
  });

  if (value > lastSliderValue && tiles[value - 1]) {
    playLetter(tiles[value - 1].textContent);
  }

  lastSliderValue = value;
});

// ----- BUTTON BLEND (SLOW + CLEAR) -----
blendBtn.addEventListener("click", () => {
  const tiles = document.querySelectorAll(".letter");
  let index = 0;

  const interval = setInterval(() => {
    if (index < tiles.length) {
      tiles.forEach(t => (t.style.backgroundColor = "#e6f2ff"));
      tiles[index].style.backgroundColor = "#ffd966";
      playLetter(tiles[index].textContent);
      index++;
    } else {
      clearInterval(interval);
      setTimeout(() => speakWholeWord(currentWord), 500);
    }
  }, 650); // 👈 slowed blend timing
});

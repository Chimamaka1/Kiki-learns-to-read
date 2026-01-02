/* ==============================
   AUDIO GATE (iPAD REQUIRED)
================================ */

let audioReady = false;

const startBtn = document.getElementById("start-audio");
const audioGate = document.getElementById("audio-gate");

startBtn.onclick = () => {
  // MUST play audio INSIDE this tap
  const test = new Audio("sounds_clean/a.mp3");
  test.play().catch(() => {});
  speechSynthesis.speak(new SpeechSynthesisUtterance("Let's read!"));

  audioReady = true;
  audioGate.style.display = "none";
};

/* ==============================
   DOM
================================ */

const wordDisplay = document.getElementById("word-display");
const slider = document.getElementById("blend-slider");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");

const vcBtn = document.getElementById("vc-button");
const cvBtn = document.getElementById("cv-button");
const cvcBtn = document.getElementById("cvc-button");

/* ==============================
   WORDS
================================ */

const vcWords = ["at","an","am","it","in","on","up"];
const cvWords = ["ma","pa","no","go"];
const cvcWords = ["cat","dog","sun","bat","hat"];

let words = vcWords;
let currentWord = "";
let letters = [];

/* ==============================
   HELPERS
================================ */

function playLetter(letter) {
  if (!audioReady) return;
  const a = new Audio(`sounds_clean/${letter}.mp3`);
  a.currentTime = 0;
  a.play().catch(() => {});
}

function speakWord(word) {
  if (!audioReady) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(word));
}

/* ==============================
   RENDER
================================ */

function renderWord(word) {
  wordDisplay.innerHTML = "";
  letters = [];

  [...word].forEach(l => {
    const d = document.createElement("div");
    d.className = "letter";
    d.textContent = l;
    d.onclick = () => playLetter(l);
    wordDisplay.appendChild(d);
    letters.push(d);
  });

  slider.max = letters.length - 1;
  slider.value = 0;
}

function newWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
}

/* ==============================
   EVENTS
================================ */

slider.oninput = () => {
  const i = Math.round(slider.value);
  letters.forEach(l => l.classList.remove("active"));
  letters[i]?.classList.add("active");
};

blendBtn.onclick = () => speakWord(currentWord);
newWordBtn.onclick = newWord;

vcBtn.onclick = () => { words = vcWords; newWord(); };
cvBtn.onclick = () => { words = cvWords; newWord(); };
cvcBtn.onclick = () => { words = cvcWords; newWord(); };

/* ==============================
   START
================================ */

newWord();

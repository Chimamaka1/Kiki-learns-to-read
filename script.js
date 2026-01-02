/* ==============================
   CONTINUOUS BLENDING ENGINE
================================ */

const CONTINUANTS = ["s","m","n","f","l","r","v","z"];
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

document.body.addEventListener("click", () => {
  if (audioCtx.state === "suspended") audioCtx.resume();
}, { once: true });

/* 🔧 NEW: keep track of active phoneme */
let activeSource = null;

async function playContinuousBlend(word) {
  let startTime = audioCtx.currentTime;

  for (let letter of word) {
    const response = await fetch(`sounds_clean/${letter}.mp3`);
    const buffer = await audioCtx.decodeAudioData(await response.arrayBuffer());

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = CONTINUANTS.includes(letter) ? 0.7 : 1;

    source.connect(audioCtx.destination);
    source.start(startTime);

    const overlap = CONTINUANTS.includes(letter) ? 0.55 : 0.75;
    startTime += buffer.duration * overlap;
  }
}

/* ==============================
   DOM ELEMENTS
================================ */

const wordDisplay = document.getElementById("word-display");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

const vcBtn  = document.getElementById("vc-button");
const cvBtn  = document.getElementById("cv-button");
const cvcBtn = document.getElementById("cvc-button");

/* ==============================
   WORD BANKS
================================ */

const vcWords = [
  "at","an","am","ap","ad","ag","as",
  "et","en","em","ep","ed","eg","es",
  "it","in","im","ip","id","ig","is",
  "ot","on","om","op","od","og","os",
  "ut","un","um","up","ud","ug","us"
];

const cvWords = [
  "ma","pa","sa","ta","na","la","ra",
  "go","no","so"
];

const cvcWords = [
  "cat","bat","mat","rat","sat","pat",
  "dog","dig","log","fog","hog",
  "pin","tin","bin","fin","win",
  "cap","map","tap","nap",
  "sun","fun","run","bun",
  "cot","hot","pot","dot",
  "man","fan","can","pan","ran","tan",
  "bed","red","fed","led","wed",
  "pen","hen","ten","men",
  "cup","mug","bug","hug","rug",
  "lip","sip","dip","hip","tip",
  "jam","ham","ram","yam",
  "kit","sit","hit","pit","fit"
];

/* ==============================
   STATE
================================ */

let mode = "VC";
let activeWords = vcWords;
let currentWord = "";
let letters = [];
let blending = false;

/* ==============================
   AUDIO HELPERS
================================ */

/* 🔧 IMPROVED: stop previous sound before playing new */
function playSound(name) {
  if (blending) return; // 🔑 prevent spam during auto-blend

  if (activeSource) {
    try { activeSource.stop(); } catch {}
    activeSource = null;
  }

  const audio = audioCtx.createBufferSource();

  fetch(`sounds_clean/${name}.mp3`)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(decoded => {
      audio.buffer = decoded;
      audio.connect(audioCtx.destination);
      audio.start();
      activeSource = audio;
    });
}

/* ==============================
   RENDER WORD
================================ */

function renderWord(word) {
  wordDisplay.innerHTML = "";
  letters = [];

  [...word].forEach(letter => {
    const tile = document.createElement("div");
    tile.className = "letter";
    tile.textContent = letter;
    tile.onclick = () => playSound(letter);
    wordDisplay.appendChild(tile);
    letters.push(tile);
  });

  slider.max = letters.length - 1;
  slider.value = 0;
}

/* ==============================
   MODE SWITCHING
================================ */

function setMode(newMode) {
  mode = newMode;

  if (mode === "VC")  activeWords = vcWords;
  if (mode === "CV")  activeWords = cvWords;
  if (mode === "CVC") activeWords = cvcWords;

  newWord();
}

vcBtn.onclick  = () => setMode("VC");
cvBtn.onclick  = () => setMode("CV");
cvcBtn.onclick = () => setMode("CVC");

/* ==============================
   WORD LOGIC
================================ */

function newWord() {
  currentWord = activeWords[Math.floor(Math.random() * activeWords.length)];
  renderWord(currentWord);
}

newWordBtn.onclick = newWord;

/* ==============================
   SLIDER
================================ */

slider.oninput = () => {
  if (!letters.length) return;

  letters.forEach(l => l.classList.remove("active"));
  const i = Math.round(slider.value);
  letters[i]?.classList.add("active");

  playSound(letters[i].textContent);
};

/* ==============================
   BLEND BUTTON (SMOOTH + CLEAN AUDIO)
================================ */

blendBtn.onclick = () => {
  if (!letters.length || blending) return;
  blending = true;

  const max = letters.length - 1;
  const duration = 900;
  const start = performance.now();

  function animate(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = progress * progress * (3 - 2 * progress);

    slider.value = eased * max;

    letters.forEach(l => l.classList.remove("active"));
    letters[Math.round(slider.value)]?.classList.add("active");

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      playContinuousBlend(currentWord);
      blending = false;
    }
  }

  requestAnimationFrame(animate);
};

/* ==============================
   START
================================ */

setMode("VC");

/* ==============================
   AUDIO SETUP
================================ */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

document.body.addEventListener("click", () => {
  if (audioCtx.state === "suspended") audioCtx.resume();
}, { once: true });

let activeSource = null;

/* ==============================
   TTS VOICE (FEMALE, CHEERFUL)
================================ */

let femaleVoice = null;

function loadFemaleVoice() {
  const voices = speechSynthesis.getVoices();
  femaleVoice =
    voices.find(v => /female|woman|girl/i.test(v.name)) ||
    voices.find(v => /en/i.test(v.lang)) ||
    voices[0];
}

speechSynthesis.onvoiceschanged = loadFemaleVoice;
loadFemaleVoice();

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

/* 🔒 HARD AUDIO LOCK */
let sliderSoundEnabled = true;

/* ==============================
   AUDIO HELPERS
================================ */

function playSound(name) {
  if (!sliderSoundEnabled) return;

  if (activeSource) {
    try { activeSource.stop(); } catch {}
    activeSource = null;
  }

  fetch(`sounds_clean/${name}.mp3`)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(decoded => {
      const src = audioCtx.createBufferSource();
      src.buffer = decoded;
      src.connect(audioCtx.destination);
      src.start();
      activeSource = src;
    });
}

function speakWholeWord(word) {
  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(word);
  utter.voice = femaleVoice;
  utter.rate = 0.9;
  utter.pitch = 1.25;
  utter.volume = 1;

  speechSynthesis.speak(utter);
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

  // ✅ NEW: adjust slider width to match word width
  requestAnimationFrame(adjustSliderToWord);
}

/* ==============================
   ADJUST SLIDER WIDTH (NEW)
================================ */

function adjustSliderToWord() {
  if (letters.length === 0) return;

  const first = letters[0].getBoundingClientRect();
  const last  = letters[letters.length - 1].getBoundingClientRect();
  const parent = wordDisplay.getBoundingClientRect();

  // Distance from centre of first letter to centre of last letter
  const sliderWidth =
    (last.left + last.width / 2) -
    (first.left + first.width / 2);

  slider.style.width = sliderWidth + "px";

  // Center slider under the word
  const sliderOffset =
    (first.left + last.right) / 2 - parent.left - sliderWidth / 2;

  slider.style.marginLeft = sliderOffset + "px";
  slider.style.marginRight = "0";
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
   BLEND BUTTON
================================ */

blendBtn.onclick = () => {
  if (!letters.length || blending) return;

  blending = true;
  sliderSoundEnabled = false;

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
      setTimeout(() => {
        speakWholeWord(currentWord);
        blending = false;
        sliderSoundEnabled = true;
      }, 150);
    }
  }

  requestAnimationFrame(animate);
};

/* ==============================
   START
================================ */

setMode("VC");

/* ==============================
   AUDIO SETUP (iPAD SAFE)
================================ */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioUnlocked = false;
let activeSource = null;

/* ==============================
   SOUND CACHE (REQUIRED FOR iOS)
================================ */

const soundCache = {};
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

function unlockAudioIOS() {
  if (audioUnlocked) return;

  // 🔑 Unlock AudioContext
  const buffer = audioCtx.createBuffer(1, 1, 22050);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start(0);

  // 🔑 Unlock Speech
  speechSynthesis.speak(new SpeechSynthesisUtterance(""));

  // 🔑 Preload ALL letter sounds synchronously
  LETTERS.forEach(letter => {
    const audio = new Audio(`sounds_clean/${letter}.mp3`);
    audio.load();
    soundCache[letter] = audio;
  });

  audioUnlocked = true;
}

/* ==============================
   TTS (FEMALE)
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

const vcWords = ["at","an","am","ap","ad","ag","as","et","en","em","ep","ed","eg","es","it","in","im","ip","id","ig","is","ot","on","om","op","od","og","os","ut","un","um","up","ud","ug","us"];
const cvWords = ["ma","pa","sa","ta","na","la","ra","go","no","so"];
const cvcWords = ["cat","bat","mat","rat","sat","pat","dog","dig","log","fog","hog","pin","tin","bin","fin","win","cap","map","tap","nap","sun","fun","run","bun","cot","hot","pot","dot","man","fan","can","pan","ran","tan","bed","red","fed","led","wed","pen","hen","ten","men","cup","mug","bug","hug","rug","lip","sip","dip","hip","tip","jam","ham","ram","yam","kit","sit","hit","pit","fit"];

/* ==============================
   STATE
================================ */

let mode = "VC";
let activeWords = vcWords;
let currentWord = "";
let letters = [];
let blending = false;
let sliderSoundEnabled = true;

/* ==============================
   AUDIO HELPERS (NO FETCH!)
================================ */

function playSound(letter) {
  if (!sliderSoundEnabled || !audioUnlocked) return;

  const audio = soundCache[letter];
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function speakWholeWord(word) {
  if (!audioUnlocked) return;

  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(word);
  utter.voice = femaleVoice;
  utter.rate = 0.9;
  utter.pitch = 1.25;
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
    tile.onclick = () => {
      unlockAudioIOS();
      playSound(letter);
    };
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
  unlockAudioIOS();
  mode = newMode;
  activeWords = mode === "VC" ? vcWords : mode === "CV" ? cvWords : cvcWords;
  newWord();
}

vcBtn.onclick  = () => setMode("VC");
cvBtn.onclick  = () => setMode("CV");
cvcBtn.onclick = () => setMode("CVC");

/* ==============================
   WORD LOGIC
================================ */

function newWord() {
  unlockAudioIOS();
  currentWord = activeWords[Math.floor(Math.random() * activeWords.length)];
  renderWord(currentWord);
}

newWordBtn.onclick = newWord;

/* ==============================
   SLIDER
================================ */

slider.oninput = () => {
  if (!letters.length || blending) return;
  const i = Math.round(slider.value);
  playSound(letters[i].textContent);
};

/* ==============================
   BLEND BUTTON
================================ */

blendBtn.onclick = () => {
  unlockAudioIOS();
  if (blending) return;

  blending = true;
  sliderSoundEnabled = false;

  setTimeout(() => {
    speakWholeWord(currentWord);
    blending = false;
    sliderSoundEnabled = true;
  }, 100);
};

/* ==============================
   START
================================ */

setMode("VC");

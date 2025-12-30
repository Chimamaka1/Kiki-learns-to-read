/* ===== CONTINUOUS BLENDING ENGINE ===== */

// sounds that can be stretched
const CONTINUANTS = ["s","m","n","f","l","r","v","z"];

// audio context (required for overlap)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

async function playContinuousBlend(word) {
  let startTime = audioCtx.currentTime;

  for (let i = 0; i < word.length; i++) {
    const letter = word[i];

    // load sound
    const response = await fetch(`sounds_clean/${letter}.mp3`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await audioCtx.decodeAudioData(arrayBuffer);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    // stretch continuous sounds
    source.playbackRate.value = CONTINUANTS.includes(letter) ? 0.7 : 1.0;

    source.connect(audioCtx.destination);

    // play sound
    source.start(startTime);

    // overlap timing
    const overlapFactor = CONTINUANTS.includes(letter) ? 0.55 : 0.75;
    startTime += buffer.duration * overlapFactor;
  }
}

const wordDisplay = document.getElementById("word-display");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");
const reward = document.getElementById("reward");

const words = [
  "cat","bat","mat","rat","sat","pat",
  "dog","dig","log","fog","hog",
  "pin","tin","bin","fin","win",
  "cap","map","tap","nap",
  "sun","fun","run","bun",
  "cot","hot","pot","dot"
];

let currentWord = "";
let letters = [];
let blending = false;

/* ---------- AUDIO ---------- */
function playSound(name) {
  const audio = new Audio();
  audio.src = `sounds_clean/${name}.mp3`;
  audio.onerror = () => audio.src = `sounds_clean/${name}.m4a`;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function speakWord(word) {
  const utter = new SpeechSynthesisUtterance(word);
  utter.rate = 0.8;
  utter.pitch = 1.2;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

/* ---------- REWARD ---------- */
function showReward() {
  reward.classList.remove("hidden");
  setTimeout(() => reward.classList.add("hidden"), 1200);
}

function encourage() {
  const phrases = [
    "Well done!",
    "Great blending!",
    "You did it!",
    "Amazing reading!"
  ];
  const utter = new SpeechSynthesisUtterance(
    phrases[Math.floor(Math.random() * phrases.length)]
  );
  utter.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

/* ---------- RENDER ---------- */
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

/* ---------- NEW WORD ---------- */
newWordBtn.onclick = () => {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
};

/* ---------- SLIDER ---------- */
slider.oninput = () => {
  if (!letters.length || blending) return;
  letters.forEach(l => l.classList.remove("active"));
  const i = Number(slider.value);
  if (letters[i]) {
    letters[i].classList.add("active");
    playSound(letters[i].textContent);
  }
};

/* ---------- BLEND ---------- */
blendBtn.onclick = async () => {
  if (!letters.length) return;
  blending = true;

  // highlight letters as we blend
  for (let i = 0; i < letters.length; i++) {
    letters.forEach(l => l.classList.remove("active"));
    letters[i].classList.add("active");
    await new Promise(r => setTimeout(r, 350));
  }

  // 🔊 CONTINUOUS MELTING BLEND
  await playContinuousBlend(currentWord);

  // short pause
  await new Promise(r => setTimeout(r, 500));

  // say whole word
  speakWord(currentWord);

  // reward
  showReward();
  encourage();

  blending = false;
};


/* ---------- START ---------- */
newWordBtn.click();


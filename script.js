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

  // blend letters
  for (let i = 0; i < letters.length; i++) {
    letters.forEach(l => l.classList.remove("active"));
    letters[i].classList.add("active");
    playSound(letters[i].textContent);
    await new Promise(r => setTimeout(r, 800));
  }

  // say whole word
  await new Promise(r => setTimeout(r, 500));
  speakWord(currentWord);

  // reward + encouragement
  showReward();
  encourage();

  blending = false;
};

/* ---------- START ---------- */
newWordBtn.click();


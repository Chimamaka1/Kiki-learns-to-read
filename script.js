const wordDisplay = document.getElementById("word-display");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

const words = [
  "cat","bat","mat","rat","sat","pat",
  "dog","dig","log","fog","hog",
  "pin","tin","bin","fin","win",
  "cap","map","tap","nap",
  "red","bed","fed","led",
  "sun","fun","run","bun",
  "cot","hot","pot","dot"
];

let currentWord = "";
let letters = [];
let lastSliderValue = 0;

/* ---------- AUDIO ---------- */
function playSound(letter) {
  const audio = new Audio(`sounds_clean/${letter}.mp3`);
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function speakWord(word) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.rate = 0.6;
  speechSynthesis.speak(u);
}

/* ---------- RENDER ---------- */
function renderWord(word) {
  wordDisplay.innerHTML = "";
  letters = [];

  [...word].forEach(letter => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = letter;

    span.onclick = () => playSound(letter);

    wordDisplay.appendChild(span);
    letters.push(span);
  });

  slider.min = 0;
  slider.max = letters.length;
  slider.value = 0;
  lastSliderValue = 0;
}

/* ---------- WORD PICKER ---------- */
function newWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
}

/* ---------- SLIDER ---------- */
slider.addEventListener("input", () => {
  const value = Number(slider.value);

  letters.forEach((l, i) => {
    l.classList.toggle("active", i === value - 1);
  });

  if (value > lastSliderValue && letters[value - 1]) {
    playSound(letters[value - 1].textContent);
  }

  lastSliderValue = value;
});

/* ---------- BLEND ---------- */
blendBtn.addEventListener("click", async () => {
  for (let i = 0; i < letters.length; i++) {
    letters.forEach(l => l.classList.remove("active"));
    letters[i].classList.add("active");
    playSound(letters[i].textContent);
    await new Promise(r => setTimeout(r, 650));
  }

  await new Promise(r => setTimeout(r, 400));
  speakWord(currentWord);
});

/* ---------- BUTTON ---------- */
newWordBtn.addEventListener("click", newWord);

/* ---------- 🔑 IMPORTANT ---------- */
newWord(); // render FIRST word on load

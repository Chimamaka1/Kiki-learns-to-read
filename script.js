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

/* ---------- AUDIO ---------- */
function playSound(letter) {
  const audio = new Audio(`sounds_clean/${letter}.mp3`);
  audio.play();
}

function playWord(word) {
  const audio = new Audio(`sounds_clean/${word}.mp3`);
  audio.play();
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

  slider.max = letters.length - 1;
  slider.value = 0;
}

/* ---------- WORD PICKER ---------- */
function newWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
}

/* ---------- SLIDER ---------- */
slider.addEventListener("input", () => {
  letters.forEach(l => l.classList.remove("active"));
  const index = Number(slider.value);
  letters[index].classList.add("active");
  playSound(letters[index].textContent);
});

/* ---------- BLEND ---------- */
blendBtn.addEventListener("click", async () => {
  for (let i = 0; i < letters.length; i++) {
    letters.forEach(l => l.classList.remove("active"));
    letters[i].classList.add("active");
    playSound(letters[i].textContent);
    await new Promise(r => setTimeout(r, 600));
  }

  await new Promise(r => setTimeout(r, 400));
  playWord(currentWord);
});

/* ---------- BUTTON ---------- */
newWordBtn.addEventListener("click", newWord);

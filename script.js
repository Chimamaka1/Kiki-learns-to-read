const wordDisplay = document.getElementById("word-display");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

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

function playSound(name) {
  const audio = new Audio();
  audio.src = `sounds_clean/${name}.mp3`;
  audio.onerror = () => audio.src = `sounds_clean/${name}.m4a`;
  audio.play();
}

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

newWordBtn.onclick = () => {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
};

slider.oninput = () => {
  if (!letters.length || blending) return;
  letters.forEach(l => l.classList.remove("active"));
  const i = Number(slider.value);
  letters[i].classList.add("active");
  playSound(letters[i].textContent);
};

blendBtn.onclick = async () => {
  if (!letters.length) return;
  blending = true;

  for (let i = 0; i < letters.length; i++) {
    letters.forEach(l => l.classList.remove("active"));
    letters[i].classList.add("active");
    playSound(letters[i].textContent);
    await new Promise(r => setTimeout(r, 800));
  }

  await new Promise(r => setTimeout(r, 500));
  playSound(currentWord);
  blending = false;
};

newWordBtn.click();

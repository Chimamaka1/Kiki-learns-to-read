/* =========================
   POP THE BALLOON GAME
========================= */

const popSound = new Audio("sounds_clean/pop.mp3");

const letters = [
  "a","b","c","d","e","f","g","h","i","j","k","l",
  "m","n","o","p","q","r","s","t","u","v","w","x","y","z"
];

const sky = document.getElementById("sky");
const playBtn = document.getElementById("play-sound");
const reward = document.getElementById("reward");

let targetLetter = "";
let roundTimeout = null;

/* =========================
   FAIR RANDOMISATION
========================= */

let letterBag = [];
let lastLetter = null;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getNextTargetLetter() {
  if (letterBag.length === 0) {
    letterBag = [...letters];
    shuffle(letterBag);
  }

  let next = letterBag.pop();

  if (next === lastLetter && letterBag.length > 0) {
    const swap = letterBag.pop();
    letterBag.unshift(next);
    next = swap;
  }

  lastLetter = next;
  return next;
}

/* =========================
   AUDIO
========================= */

function playLetter(letter) {
  const audio = new Audio(`sounds_clean/${letter}.mp3`);
  audio.play().catch(() => {});
}

/* =========================
   REWARD
========================= */

function showReward() {
  reward.classList.remove("hidden");
  setTimeout(() => reward.classList.add("hidden"), 1000);
}

/* =========================
   CREATE BALLOON
========================= */

function createBalloon(letter, index, total) {
  const balloon = document.createElement("div");
  balloon.className = "balloon";

  // mix uppercase / lowercase display
  const isUpper = Math.random() < 0.5;
  balloon.textContent = isUpper ? letter.toUpperCase() : letter;

  // evenly space balloons
  const spacing = 100 / (total + 1);
  balloon.style.left = spacing * (index + 1) + "%";

  // random colour
  const color = ["#ffb6c1","#b39ddb","#81d4fa","#a5d6a7"]
    [Math.floor(Math.random() * 4)];
  balloon.style.background = color;
  balloon.style.setProperty("--balloon-color", color);

  balloon.onclick = () => {
    // 💥 pop sound
    popSound.currentTime = 0;
    popSound.play().catch(() => {});

    // 🔊 letter sound
    playLetter(letter);

    // correct balloon
    if (letter === targetLetter) {
      if (roundTimeout) {
        clearTimeout(roundTimeout);
        roundTimeout = null;
      }

      balloon.remove();
      showReward();
      setTimeout(startRound, 800);
    }
  };

  sky.appendChild(balloon);

  // auto-remove if not clicked
  setTimeout(() => balloon.remove(), 6000);
}

/* =========================
   START ROUND
========================= */

function startRound() {
  sky.innerHTML = "";

  if (roundTimeout) {
    clearTimeout(roundTimeout);
    roundTimeout = null;
  }

  targetLetter = getNextTargetLetter();

  setTimeout(() => playLetter(targetLetter), 500);

  let options = [targetLetter];
  while (options.length < 3) {
    const l = letters[Math.floor(Math.random() * letters.length)];
    if (!options.includes(l)) options.push(l);
  }

  options.forEach((l, index) => {
    createBalloon(l, index, options.length);
  });

  roundTimeout = setTimeout(startRound, 7000);
}

/* =========================
   EVENTS
========================= */

playBtn.onclick = () => playLetter(targetLetter);

/* =========================
   START GAME
========================= */

startRound();

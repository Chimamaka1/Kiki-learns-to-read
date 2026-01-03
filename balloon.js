/* =========================
   POP THE BALLOON GAME
========================= */

const letters = ["a","b","c","d","f","m","s","t"];

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

  // avoid immediate repeat
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
  balloon.textContent = letter;

  // evenly space balloons
  const spacing = 100 / (total + 1);
  balloon.style.left = spacing * (index + 1) + "%";

  // random colour
  const color = ["#ffb6c1","#b39ddb","#81d4fa","#a5d6a7"]
    [Math.floor(Math.random() * 4)];
  balloon.style.background = color;
  balloon.style.setProperty("--balloon-color", color);

  balloon.onclick = () => {
    playLetter(letter);

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

  // remove balloon after float
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

  // get fair next letter
  targetLetter = getNextTargetLetter();

  // play target sound
  setTimeout(() => playLetter(targetLetter), 500);

  // build options
  let options = [targetLetter];
  while (options.length < 3) {
    const l = letters[Math.floor(Math.random() * letters.length)];
    if (!options.includes(l)) options.push(l);
  }

  options.forEach((l, index) => {
    createBalloon(l, index, options.length);
  });

  // auto-continue even if no click
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

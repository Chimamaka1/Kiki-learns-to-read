/* =========================
   POP THE BALLOON GAME
========================= */

/* ---------- LETTER SET ---------- */
const letters = [
  "a","b","c","d","e","f","g","h","i","j","k","l",
  "m","n","o","p","q","r","s","t","u","v","w","x","y","z"
];

/* ---------- DOM ---------- */
const sky = document.getElementById("sky");
const playBtn = document.getElementById("play-sound");
const reward = document.getElementById("reward");

/* ---------- STATE ---------- */
let targetLetter = "";
let roundTimeout = null;

/* ---------- AUDIO ---------- */
const popSound = new Audio("../../assets/sounds/pop.mp3");
let audioUnlocked = false;

/* ---------- AUDIO UNLOCK (MOBILE SAFE) ---------- */
function unlockAudio() {
  if (audioUnlocked) return;

  popSound.play()
    .then(() => {
      popSound.pause();
      popSound.currentTime = 0;
      audioUnlocked = true;
    })
    .catch(() => {});
}

document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

function playLetter(letter) {
  const audio = new Audio(`../../assets/sounds/${letter}.mp3`);
  audio.play().catch(() => {});
}

/* ---------- SHUFFLE HELPERS ---------- */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* ---------- FAIR TARGET RANDOMISATION ---------- */
let letterBag = [];
let lastLetter = null;

function getNextTargetLetter() {
  if (letterBag.length === 0) {
    letterBag = [...letters];
    shuffleArray(letterBag);
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

/* ---------- REWARD ---------- */
function showReward() {
  reward.classList.remove("hidden");
  setTimeout(() => reward.classList.add("hidden"), 1000);
}

/* ---------- CREATE BALLOON ---------- */
function createBalloon(letter, index, total) {
  const balloon = document.createElement("div");
  balloon.className = "balloon";

  // random uppercase / lowercase display
  const isUpper = Math.random() < 0.5;
  balloon.textContent = isUpper ? letter.toUpperCase() : letter;

  // even horizontal spacing
  const spacing = 100 / (total + 1);
  balloon.style.left = spacing * (index + 1) + "%";

  // random colour
  const colors = ["#ffb6c1","#b39ddb","#81d4fa","#a5d6a7"];
  balloon.style.background = colors[Math.floor(Math.random() * colors.length)];

  balloon.onclick = () => {
    // 💥 pop sound
    if (audioUnlocked) {
      popSound.currentTime = 0;
      popSound.play().catch(() => {});
    }

    // 🔊 letter sound
    playLetter(letter);

    // correct choice
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

/* ---------- START ROUND ---------- */
function startRound() {
  sky.innerHTML = "";

  if (roundTimeout) {
    clearTimeout(roundTimeout);
    roundTimeout = null;
  }

  // choose target letter fairly
  targetLetter = getNextTargetLetter();

  // play target sound
  setTimeout(() => playLetter(targetLetter), 500);

  // build options
  let options = [targetLetter];
  while (options.length < 3) {
    const l = letters[Math.floor(Math.random() * letters.length)];
    if (!options.includes(l)) options.push(l);
  }

  // RANDOMISE POSITIONS
  shuffleArray(options);

  options.forEach((l, index) => {
    createBalloon(l, index, options.length);
  });

  // auto-continue even if no click
  roundTimeout = setTimeout(startRound, 7000);
}

/* ---------- EVENTS ---------- */
playBtn.onclick = () => playLetter(targetLetter);

/* ---------- START GAME ---------- */
startRound();

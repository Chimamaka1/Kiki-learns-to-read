/* =========================
   POP THE BALLOON GAME
========================= */

const letters = ["a","b","c","d","f","m","s","t"];
const sky = document.getElementById("sky");
const playBtn = document.getElementById("play-sound");
const reward = document.getElementById("reward");

let targetLetter = "";

/* ---------- PLAY LETTER SOUND ---------- */
function playLetter(letter) {
  const audio = new Audio(`sounds_clean/${letter}.mp3`);
  audio.play().catch(() => {});
}

/* ---------- REWARD ---------- */
function showReward() {
  reward.classList.remove("hidden");
  setTimeout(() => reward.classList.add("hidden"), 1000);
}

/* ---------- CREATE BALLOON ---------- */
function createBalloon(letter,index,total) {
  const balloon = document.createElement("div");
  balloon.className = "balloon";
  balloon.textContent = letter;

   const spacing = 100 / (total + 1);
const leftPosition = spacing * (index + 1);

balloon.style.left = leftPosition + "%";

  balloon.style.background = ["#ffb6c1","#b39ddb","#81d4fa","#a5d6a7"]
    [Math.floor(Math.random() * 4)];

  balloon.onclick = () => {
    if (letter === targetLetter) {
      balloon.remove();
      showReward();
      playLetter(letter);
      setTimeout(startRound, 800);
    } else {
      playLetter(letter);
    }
  };

  sky.appendChild(balloon);

  setTimeout(() => balloon.remove(), 6000);
}

/* ---------- START ROUND ---------- */
function startRound() {
  sky.innerHTML = "";

  targetLetter = letters[Math.floor(Math.random() * letters.length)];

  setTimeout(() => playLetter(targetLetter), 500);

  let options = [targetLetter];
  while (options.length < 3) {
    const l = letters[Math.floor(Math.random() * letters.length)];
    if (!options.includes(l)) options.push(l);
  }

 options.forEach((l, index) => {
  createBalloon(l, index, options.length);
});

}

/* ---------- EVENTS ---------- */
playBtn.onclick = () => playLetter(targetLetter);

/* ---------- START ---------- */
startRound();

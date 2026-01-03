/* =========================
   CRACK THE EGG – IMAGE MATCH
========================= */

const items = [
  { word: "cat", img: "images/cat.png" },
  { word: "dog", img: "images/dog.png" },
  { word: "sun", img: "images/sun.png" },
  { word: "hat", img: "images/hat.png" },
  { word: "bed", img: "images/bed.png" }
];

const egg = document.getElementById("egg");
const eggImage = document.getElementById("egg-image");
const choicesDiv = document.getElementById("choices");
const playBtn = document.getElementById("play-word");
const nextBtn = document.getElementById("next");
const reward = document.getElementById("reward");

let correctWord = "";
let cracked = false;

/* ---------- SPEAK ---------- */
function speakWord(word) {
  const u = new SpeechSynthesisUtterance(word);
  u.rate = 0.7;
  u.pitch = 1.1;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/* ---------- REWARD ---------- */
function showReward() {
  reward.classList.remove("hidden");
  setTimeout(() => reward.classList.add("hidden"), 1200);
}

/* ---------- NEW ROUND ---------- */
function newRound() {
  cracked = false;
  choicesDiv.innerHTML = "";
  egg.classList.remove("cracked");
  eggImage.classList.add("hidden");

  const item = items[Math.floor(Math.random() * items.length)];
  correctWord = item.word;
  eggImage.src = item.img;
  eggImage.alt = correctWord;

  let options = [correctWord];
  while (options.length < 3) {
    const w = items[Math.floor(Math.random() * items.length)].word;
    if (!options.includes(w)) options.push(w);
  }

  options.sort(() => Math.random() - 0.5);

  options.forEach(word => {
    const btn = document.createElement("div");
    btn.className = "word-choice";
    btn.textContent = word;

    btn.onclick = () => {
      speakWord(word);
      if (word === correctWord) {
        showReward();
      } else {
        setTimeout(() => speakWord("Try again"), 800);
      }
    };

    choicesDiv.appendChild(btn);
  });
}

/* ---------- CRACK EGG ---------- */
egg.onclick = () => {
  if (cracked) return;

  cracked = true;
  egg.classList.add("cracked");

  setTimeout(() => {
    eggImage.classList.remove("hidden");
    speakWord(correctWord);
  }, 400);
};

/* ---------- EVENTS ---------- */
playBtn.onclick = () => speakWord(correctWord);
nextBtn.onclick = newRound;

/* ---------- START ---------- */
newRound();

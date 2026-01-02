/* =========================
   LISTEN & CHOOSE (PHONICS)
========================= */

const words = [
  "cat","dog","sun","hat","mat","bat","rat",
  "bed","pen","hen",
  "pin","bin","tin",
  "cot","pot","hot",
  "bug","hug","mug"
];

const playBtn = document.getElementById("play-word");
const choicesDiv = document.getElementById("choices");
const nextBtn = document.getElementById("next-question");
const reward = document.getElementById("reward");

let correctWord = "";

/* ---------- SPEAK FULL WORD ---------- */
function speakWord(word) {
  const utter = new SpeechSynthesisUtterance(word);
  utter.rate = 0.8;
  utter.pitch = 1.2;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

/* ---------- PLAY SINGLE LETTER ---------- */
function playLetter(letter) {
  const audio = new Audio(`sounds_clean/${letter}.mp3`);
  audio.play().catch(() => {});
}

/* ---------- REWARD ---------- */
function showReward() {
  reward.classList.remove("hidden");
  setTimeout(() => reward.classList.add("hidden"), 1200);
}

/* ---------- NEW QUESTION ---------- */
function newQuestion() {
  choicesDiv.innerHTML = "";

  correctWord = words[Math.floor(Math.random() * words.length)];

  let options = [correctWord];
  while (options.length < 3) {
    const w = words[Math.floor(Math.random() * words.length)];
    if (!options.includes(w)) options.push(w);
  }

  options.sort(() => Math.random() - 0.5);

  options.forEach(word => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "word-option";

    const lettersDiv = document.createElement("div");
    lettersDiv.className = "letters";

    [...word].forEach(letter => {
      const tile = document.createElement("div");
      tile.className = "letter-tile";
      tile.textContent = letter;

      // play individual phoneme
      tile.onclick = (e) => {
        e.stopPropagation();
        playLetter(letter);
      };

      lettersDiv.appendChild(tile);
    });

    // choosing the whole word
    optionDiv.onclick = () => {
      if (word === correctWord) {
        showReward();
        speakWord("Well done");
      } else {
        speakWord("Try again");
      }
    };

    optionDiv.appendChild(lettersDiv);
    choicesDiv.appendChild(optionDiv);
  });

  // auto say the target word
  setTimeout(() => speakWord(correctWord), 500);
}

/* ---------- EVENTS ---------- */
playBtn.onclick = () => speakWord(correctWord);
nextBtn.onclick = newQuestion;

/* ---------- START ---------- */
newQuestion();

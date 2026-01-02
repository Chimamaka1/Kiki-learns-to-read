/* =========================
   LISTEN & CHOOSE GAME
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

/* ---------- PLAY PHONICS ---------- */
function playPhonics(word) {
  let delay = 0;
  [...word].forEach(letter => {
    setTimeout(() => {
      const audio = new Audio(`sounds_clean/${letter}.mp3`);
      audio.play().catch(() => {});
    }, delay);
    delay += 450;
  });
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
    const btn = document.createElement("button");
    btn.textContent = word;
    btn.className = "choice-btn";

    btn.onclick = () => {
      playPhonics(word);

      setTimeout(() => {
        if (word === correctWord) {
          showReward();
          speakWord("Well done");
        } else {
          speakWord("Try again");
        }
      }, 1200);
    };

    choicesDiv.appendChild(btn);
  });

  setTimeout(() => speakWord(correctWord), 500);
}

/* ---------- EVENTS ---------- */
playBtn.onclick = () => speakWord(correctWord);
nextBtn.onclick = newQuestion;

/* ---------- START ---------- */
newQuestion();

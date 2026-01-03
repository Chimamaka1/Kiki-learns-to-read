/* =========================
   LISTEN & CHOOSE (PHONICS)
========================= */

const words = ["bat","cat","fat","hat","mat","pat","rat","sat","vat",
  "bad","dad","had","mad","pad","sad",
  "bag","lag","rag","tag","wag",
  "cap","gap","lap","map","nap","sap","tap","zap",
  "jam","ham","ram","yam",
  "man","fan","can","pan","ran","tan",
  "bed","fed","led","red","wed",
  "beg","leg","peg",
  "hen","men","pen","ten","den",
  "jet","net","pet","vet","get",
  "web","keg","bin","din","fin","pin","tin","win",
  "big","dig","fig","pig","wig",
  "hit","kit","lit","pit","sit","fit",
  "lip","sip","dip","hip","tip",
  "mix","six","fix","cot","dot","hot","lot","not","pot","rot",
  "dog","fog","hog","log",
  "box","fox",
  "top","mop","hop","pop",
  "job","sob","rob",
  "bug","hug","jug","mug","rug",
  "bun","fun","run","sun",
  "cup","pup","tub","rub",
  "mud","bud"
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

  // choose target word
  correctWord = words[Math.floor(Math.random() * words.length)];

  // build options
  let options = [correctWord];
  while (options.length < 3) {
    const w = words[Math.floor(Math.random() * words.length)];
    if (!options.includes(w)) options.push(w);
  }

  options.sort(() => Math.random() - 0.5);

  options.forEach(word => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "word-option";

    /* --- LETTER TILES (LISTEN ONLY) --- */
    const lettersDiv = document.createElement("div");
    lettersDiv.className = "letters";

    [...word].forEach(letter => {
      const tile = document.createElement("div");
      tile.className = "letter-tile";
      tile.textContent = letter;

      tile.onclick = () => playLetter(letter);

      lettersDiv.appendChild(tile);
    });

    /* --- CHOOSE BUTTON (ANSWER) --- */
    const chooseBtn = document.createElement("button");
    chooseBtn.className = "choose-btn";
    chooseBtn.textContent = "Choose";

    chooseBtn.onclick = () => {
      if (word === correctWord) {
        showReward();
        speakWord("Well done");
      } else {
        speakWord("Try again");
      }
    };

    optionDiv.appendChild(lettersDiv);
    optionDiv.appendChild(chooseBtn);
    choicesDiv.appendChild(optionDiv);
  });

  // auto-play the target word
  setTimeout(() => speakWord(correctWord), 600);
}

/* ---------- EVENTS ---------- */
playBtn.onclick = () => speakWord(correctWord);
nextBtn.onclick = newQuestion;

/* ---------- START ---------- */
newQuestion();

/* ==============================
   AUDIO GATE (iPAD REQUIRED)
================================ */

let audioReady = false;

const startBtn = document.getElementById("start-audio");
const audioGate = document.getElementById("audio-gate");

startBtn.onclick = () => {
  // MUST play audio INSIDE this tap
  const test = new Audio("sounds_clean/a.mp3");
  test.play().catch(() => {});
  speechSynthesis.speak(new SpeechSynthesisUtterance("Let's read!"));

  audioReady = true;
  audioGate.style.display = "none";
};

/* ---------- BACKGROUND MUSIC ---------- */

const bgMusic = new Audio("sounds_clean/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3; // gentle volume

let musicEnabled = false;
let musicUnlocked = false;

// unlock music on first user interaction
function unlockMusic() {
  if (musicUnlocked) return;

  bgMusic.play()
    .then(() => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      musicUnlocked = true;
    })
    .catch(() => {});
}

document.addEventListener("click", unlockMusic, { once: true });
document.addEventListener("touchstart", unlockMusic, { once: true });

/* ==============================
   DOM
================================ */

const wordDisplay = document.getElementById("word-display");
const slider = document.getElementById("blend-slider");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");

const vcBtn = document.getElementById("vc-button");
const cvBtn = document.getElementById("cv-button");
const cvcBtn = document.getElementById("cvc-button");

/* ==============================
   WORDS
================================ */

const vcWords = ["at","an","am","it","in","on","up","ab","ad","ag","am","an","ap","at","ax","ed","eg","em","en","et","ex","ib","id","ig","im","in","ip","it","ix","ob","od","og","om","on","op","ot","ox", "ub","ud","ug","um","un","up","ut"];
const cvWords = ["ma","pa","no","go","ba","ca","da","fa","ga","ha","ja","ka","la","ma",
  "na","pa","ra","sa","ta","va","ya","za","be","de","he","ke","le","me","ne","pe","se","te","we","bi","di","fi","hi","ki","li","mi","ni","pi","si","ti","vi","bo","co","do","fo","go","ho","jo","lo","mo","no",
  "po","so","to","yo","bu","cu","du","fu","gu","hu","ju","lu","mu","nu",
  "pu","ru","su","tu","vu"];
const cvcWords = ["bat","cat","fat","hat","mat","pat","rat","sat","vat",
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


let words = vcWords;
let currentWord = "";
let letters = [];

/* ==============================
   HELPERS
================================ */

function playLetter(letter) {
  if (!audioReady) return;
  const a = new Audio(`sounds_clean/${letter}.mp3`);
  a.currentTime = 0;
  a.play().catch(() => {});
}

function speakWord(word) {
  if (!audioReady) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(word));
}

/* ==============================
   RENDER
================================ */

function renderWord(word) {
  wordDisplay.innerHTML = "";
  letters = [];

  [...word].forEach(l => {
    const d = document.createElement("div");
    d.className = "letter";
    d.textContent = l;
    d.onclick = () => playLetter(l);
    wordDisplay.appendChild(d);
    letters.push(d);
  });

  slider.max = letters.length - 1;
  slider.value = 0;
}

function newWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
}

/* ==============================
   EVENTS
================================ */

slider.oninput = () => {
  const i = Math.round(slider.value);
  letters.forEach(l => l.classList.remove("active"));
  letters[i]?.classList.add("active");
};

blendBtn.onclick = () => speakWord(currentWord);
newWordBtn.onclick = newWord;

vcBtn.onclick = () => { words = vcWords; newWord(); };
cvBtn.onclick = () => { words = cvWords; newWord(); };
cvcBtn.onclick = () => { words = cvcWords; newWord(); };

/* ==============================
   START
================================ */

newWord();

/* ===============================
   ELEMENTS
================================ */
const wordDisplay = document.getElementById("word-display");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

/* ===============================
   FULL CVC WORD LIST
================================ */
const words = [
  // short a
  "bat","cat","fat","hat","mat","pat","rat","sat","vat",
  "bad","cad","dad","had","mad","pad","sad",
  "bag","lag","rag","tag","wag",
  "jam","ram","yam",
  "cap","lap","map","nap","tap",
  "cab","jab","lab","nab","tab",
  "can","fan","man","pan","ran","tan","van",

  // short e
  "bed","fed","led","red","wed",
  "beg","leg","peg",
  "den","hen","men","pen","ten",
  "net","pet","set","wet","jet",
  "bet","get","let","met","vet",

  // short i
  "bib","fib","rib",
  "bid","did","hid","kid","lid","rid",
  "big","dig","fig","pig","wig",
  "bin","fin","pin","tin","win",
  "fit","hit","kit","lit","sit",
  "mix","six","fix",

  // short o
  "bob","cob","job","mob","rob","sob",
  "cod","nod","rod",
  "dog","fog","hog","log",
  "cot","dot","got","hot","lot","pot","rot",
  "cop","hop","mop","top",
  "box","fox",

  // short u
  "bug","hug","jug","rug",
  "bud","mud",
  "bun","fun","gun","run","sun",
  "cup","pup",
  "cut","hut","nut","rut",
  "tub","rub"
];

/* ===============================
   STATE
================================ */
let currentWord = "";
let letters = [];
let isBlending = false;

/* ===============================
   AUDIO HELPERS
================================ */
function playSound(letter) {
  const audio = new Audio(`sounds_clean/${letter}.mp3`);
  audio.currentTime = 0;
  audio.play();
}

function playFullWord(word) {
  const audio = new Audio(`sounds_clean/${word}.mp3`);
  audio.currentTime = 0;
  audio.play();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ===============================
   RENDER WORD AS TILES
================================ */
function renderWord(word) {
  wordDisplay.innerHTML = "";
  letters = [];

  [...word].forEach(letter => {
    const tile = document.createElement("div");
    tile.className = "letter";
    tile.textContent = letter;

    tile.addEventListener("click", () => {
      if (!isBlending) playSound(letter);
    });

    wordDisplay.appendChild(tile);
    letters.push(tile);
  });

  slider.max = letters.length - 1;
  slider.value = 0;
}

/* ===============================
   NEW WORD
================================ */
function newWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
}

/* ===============================
   SLIDER = CONTROLLED BLENDING
================================ */
slider.addEventListener("input", () => {
  if (!letters.length || isBlending) return;

  letters.forEach(l => l.classList.remove("active"));
  const index = Number(slider.value);
  letters[index].classList.add("active");

  playSound(letters[index].textContent);
});

/* ===============================
   BLEND WORD BUTTON
================================ */
blendBtn.addEventListener("click", async () => {
  if (!letters.length) return;

  isBlending = true;
  slider.value = 0;

  for (let i = 0; i < letters.length; i++) {
    letters.forEach(l => l.classList.remove("active"));
    letters[i].classList.add("active");

    playSound(letters[i].textContent);
    await sleep(700); // slow, child-friendly
  }

  await sleep(500);
  playFullWord(currentWord);

  isBlending = false;
});

/* ===============================
   BUTTON
================================ */
newWordBtn.addEventListener("click", newWord);

/* ===============================
   AUTO LOAD FIRST WORD
================================ */
newWord();

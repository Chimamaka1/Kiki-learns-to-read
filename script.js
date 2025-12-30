/*************************************************
 * CVC PHONICS TRAINER – CLEAN WORKING SCRIPT
 * Uses local audio files in /sounds folder
 * Example: sounds/a.mp3, sounds/b.mp3, etc.
 *************************************************/

/* ---------- 1. CVC WORD LIST ---------- */
const cvcWords = [
  // a words
  "bat","cat","hat","mat","pat","rat",
  "can","fan","man","pan","ran","tan",
  "bag","lag","rag","tag","wag",
  "dad","had","mad","pad","sad",

  // e words
  "bed","fed","led","red","wed",
  "beg","leg","peg",
  "den","hen","men","pen","ten",
  "get","jet","met","net","pet","set",

  // i words
  "bib","fib","rib",
  "bid","did","hid","kid","lid","rid",
  "big","dig","fig","jig","pig","wig",
  "bin","fin","pin","tin","win",
  "fit","hit","kit","lit","sit",

  // o words
  "bob","cob","job","mob","rob","sob",
  "cod","pod","rod",
  "dog","fog","hog","jog","log",
  "box","fox","pox",
  "cot","dot","got","hot","pot","rot",
  "cop","hop","mop","pop","top",

  // u words
  "bub","cub","hub","rub","sub","tub",
  "bud","cud","mud",
  "bug","hug","jug","mug","rug","tug",
  "bun","fun","gun","nun","run",
  "cut","hut","nut"
];

/* ---------- 2. DOM ELEMENTS ---------- */
const wordDisplay = document.getElementById("word-display");
const newWordButton = document.getElementById("new-word-button");

/* ---------- 3. AUDIO CACHE (GLOBAL) ---------- */
const soundCache = {};

/* ---------- 4. PLAY LETTER SOUND ---------- */
function playPhoneticSound(letter) {
  const lowerLetter = letter.toLowerCase();

  if (!soundCache[lowerLetter]) {
    soundCache[lowerLetter] = new Audio(`sounds/${lowerLetter}.mp3`);
  }

  const audio = soundCache[lowerLetter];
  audio.currentTime = 0;
  audio.play().catch(err => {
    console.error("Audio play failed:", err);
  });
}

/* ---------- 5. LETTER CLICK HANDLER ---------- */
function handleLetterClick(event) {
  const letter = event.target.dataset.letter;

  // Visual feedback
  event.target.style.backgroundColor = "#a0c4ff";
  setTimeout(() => {
    event.target.style.backgroundColor = "";
  }, 200);

  playPhoneticSound(letter);
}

/* ---------- 6. DISPLAY NEW WORD ---------- */
function displayNewWord() {
  wordDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * cvcWords.length);
  const word = cvcWords[randomIndex];

  for (const letter of word) {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = letter.toUpperCase();
    span.dataset.letter = letter;
    span.addEventListener("click", handleLetterClick);

    wordDisplay.appendChild(span);
  }
}

/* ---------- 7. EVENT LISTENERS ---------- */
newWordButton.addEventListener("click", displayNewWord);

/* ---------- 8. INITIAL STATE ---------- */
document.addEventListener("DOMContentLoaded", () => {
  wordDisplay.innerHTML = `<p>Click "New Word" to start!</p>`;

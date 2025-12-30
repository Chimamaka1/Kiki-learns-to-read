// ===============================
// CVC PHONICS TRAINER – FINAL JS
// ===============================

// ----- DOM ELEMENTS -----
const wordDisplay = document.getElementById("word-display");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");

// ----- EXPANDED PHONICS WORD LIST -----
const words = [

  // Short A
  "cat","bat","rat","mat","sat","hat","pat","tap","map","jam",
  "cap","lap","man","pan","fan","can","ran","dad","bad","bag",
  "tag","rag","wag","van","tan","cab","ham","ram","sad",

  // Short E
  "bed","red","fed","led","wed","pen","hen","men","ten","net",
  "jet","vet","pet","leg","beg","peg","den","get","let","set",
  "met","yet","web","yes",

  // Short I
  "sit","pit","hit","bit","fit","kit","lit","mit","rid","did",
  "dig","fig","pig","wig","big","zip","lip","sip","tip","dip",
  "win","fin","bin","pin","tin","kid","hid",

  // Short O
  "dog","log","hog","fog","bog","cot","hot","pot","lot","not",
  "top","mop","hop","pop","cop","box","fox","rod","nod","job",
  "sob","rob","got","dot",

  // Short U
  "sun","fun","run","bun","gun","hug","jug","rug","bug","mug",
  "cup","pup","cut","nut","hut","mud","bud","tub","rub","sub"
];

// ----- STATE -----
let currentWord = "";
let lastSliderValue = 0;

// ----- AUDIO -----
function playLetter(letter) {
  const audio = new Audio(`sounds_clean/${letter}.mp3`);
  audio.play().catch(() => {});
}

function speakWholeWord(word) {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = 0.6;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

// ----- RENDER WORD (CRITICAL) -----
function renderWord(word) {
  wordDisplay.innerHTML = "";

  word.split("").forEach(letter => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = letter;

    span.addEventListener("click", () => {
      playLetter(letter);
    });

    wordDisplay.appendChild(span);
  });

  slider.value = 0;
  slider.max = word.length;
  lastSliderValue = 0;
}

// ----- NEW WORD -----
function newWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
}

newWordBtn.addEventListener("click", newWord);

// ----- SLIDER BLENDING (FINGER SLIDE) -----
slider.addEventListener("input", () => {
  const letters = document.querySelectorAll(".letter");
  const value = Number(slider.value);

  letters.forEach((l, i) => {
    l.style.backgroundColor = i < value ? "#ffe599" : "#e6f2ff";
  });

  if (value > lastSliderValue && letters[value - 1]) {
    playLetter(letters[value - 1].textContent);
  }

  lastSliderValue = value;
});

// ----- BUTTON BLEND (STEP → WHOLE WORD) -----
blendBtn.addEventListener("click", () => {
  const letters = document.querySelectorAll(".letter");
  let i = 0;

  const interval = setInterval(() => {
    if (i < letters.length) {
      playLetter(letters[i].textContent);
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => speakWholeWord(currentWord), 300);
    }
  }, 350);
});

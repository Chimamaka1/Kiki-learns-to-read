/* ==============================
   CONTINUOUS BLENDING ENGINE
================================ */

const CONTINUANTS = ["s","m","n","f","l","r","v","z"];
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Resume audio on first user interaction (mobile safety)
document.body.addEventListener("click", () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}, { once: true });

async function playContinuousBlend(word) {
  let startTime = audioCtx.currentTime;

  for (let letter of word) {
    const response = await fetch(`sounds_clean/${letter}.mp3`);
    const buffer = await audioCtx.decodeAudioData(await response.arrayBuffer());

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = CONTINUANTS.includes(letter) ? 0.7 : 1;

    source.connect(audioCtx.destination);
    source.start(startTime);

    const overlap = CONTINUANTS.includes(letter) ? 0.55 : 0.75;
    startTime += buffer.duration * overlap;
  }
}

/* ==============================
   DOM ELEMENTS
================================ */

const wordDisplay = document.getElementById("word-display");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");
const slider = document.getElementById("blend-slider");
const reward = document.getElementById("reward");

/* ==============================
   DATA
================================ */

const words = [
  "cat","bat","mat","rat","sat","pat",
  "dog","dig","log","fog","hog",
  "pin","tin","bin","fin","win",
  "cap","map","tap","nap",
  "sun","fun","run","bun",
  "cot","hot","pot","dot",
  "man","fan","can","pan","ran","tan",
  "bed","red","fed","led","wed",
  "pen","hen","ten","men",
  "cup","mug","bug","hug","rug",
  "lip","sip","dip","hip","tip",
  "jam","ham","ram","yam",
  "kit","sit","hit","pit","fit",
  "box","fox","mix","six","fix",
  "van","ran","fan","tan",
  "leg","peg","beg","jet","net",
  "mud","bud","sad","bad","mad",
  "cap","lap","sap","gap","zap",
  "top","mop","hop","pop",
  "rib","bib","fib","jib",
  "bag","rag","tag","wag",
  "hen","pen","den","men"
];

const stories = [
  [
    "The cat sat.",
    "A cat sat on a mat.",
    "The cat has a hat.",
    "The cat has a rat."
  ],
  [
    "A dog ran.",
    "The dog ran to a hut.",
    "The dog sat on a log."
  ],
  [
    "The sun is hot.",
    "A man ran in the sun."
  ]
];

/* ==============================
   STATE
================================ */

let currentWord = "";
let letters = [];
let blending = false;
let currentStory = 0;
let currentPage = 0;

/* ==============================
   AUDIO HELPERS
================================ */

function playSound(name) {
  const audio = new Audio(`sounds_clean/${name}.mp3`);
  audio.onerror = () => audio.src = `sounds_clean/${name}.m4a`;
  audio.play().catch(() => {});
}

// 🔇 NO PRAISE / NO "WELL DONE" SPEECH
function speakWord(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.8;
  utter.pitch = 1.2;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

/* ==============================
   RENDER WORD
================================ */

function renderWord(word) {
  wordDisplay.innerHTML = "";
  letters = [];

  [...word].forEach(letter => {
    const tile = document.createElement("div");
    tile.className = "letter";
    tile.textContent = letter;
    tile.onclick = () => playSound(letter);
    wordDisplay.appendChild(tile);
    letters.push(tile);
  });

  slider.max = letters.length - 1;
  slider.value = 0;
}

/* ==============================
   STORY MODE
================================ */

function renderStoryPage() {
  const container = document.createElement("div");
  container.id = "story-container";

  const sentence = stories[currentStory][currentPage];

  sentence.split(" ").forEach(word => {
    const span = document.createElement("span");
    span.className = "story-word";
    span.textContent = word;
    span.onclick = () => speakWord(word.replace(".", ""));
    container.appendChild(span);
  });

  const controls = document.createElement("div");
  controls.className = "story-controls";

  const readBtn = document.createElement("button");
  readBtn.textContent = "Read to Me";
  readBtn.onclick = () => speakWord(sentence);

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next Page";
  nextBtn.onclick = nextStoryPage;

  controls.appendChild(readBtn);
  controls.appendChild(nextBtn);
  container.appendChild(controls);

  wordDisplay.innerHTML = "";
  wordDisplay.appendChild(container);
}

function nextStoryPage() {
  currentPage++;
  if (currentPage >= stories[currentStory].length) {
    currentStory = (currentStory + 1) % stories.length;
    currentPage = 0;
  }
  renderStoryPage();
}

/* ==============================
   EVENTS
================================ */

newWordBtn.onclick = () => {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
};

slider.oninput = () => {
  if (!letters.length || blending) return;
  letters.forEach(l => l.classList.remove("active"));
  const i = Number(slider.value);
  letters[i]?.classList.add("active");
  playSound(letters[i].textContent);
};

blendBtn.onclick = async () => {
  if (!letters.length || blending) return;
  blending = true;

  for (let i = 0; i < letters.length; i++) {
    letters.forEach(l => l.classList.remove("active"));
    letters[i].classList.add("active");
    await new Promise(r => setTimeout(r, 350));
  }

  await playContinuousBlend(currentWord);
  await new Promise(r => setTimeout(r, 500));

  // 🔕 NO spoken word, NO praise
  showReward();

  blending = false;
};

const storyBtn = document.getElementById("story-button");
if (storyBtn) {
  storyBtn.onclick = () => {
    currentPage = 0;
    renderStoryPage();
  };
}

/* ==============================
   START
================================ */

newWordBtn.click();


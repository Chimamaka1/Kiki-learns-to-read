/* ==============================
   LETTERS & PHONICS GAME
================================ */

/* ==============================
   AUDIO INITIALIZATION
================================ */

let audioReady = false;

function initializeAudio() {
  bgMusic.play()
    .then(() => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    })
    .catch(() => {});

  speechSynthesis.cancel();
  audioReady = true;
}

// Initialize audio when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAudio);
} else {
  initializeAudio();
}

/* ==============================
   BACKGROUND MUSIC
================================ */

const bgMusic = new Audio("../../../assets/sounds/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

let musicEnabled = false;

/* ==============================
   DOM ELEMENTS
================================ */

let wordDisplay;
let newWordBtn;
let blendBtn;
let vcBtn;
let cvBtn;
let cvcBtn;
let musicBtn;

function initDOM() {
  wordDisplay = document.getElementById("word-display");
  newWordBtn = document.getElementById("new-word-button");
  blendBtn = document.getElementById("blend-word-button");
  
  vcBtn = document.getElementById("vc-button");
  cvBtn = document.getElementById("cv-button");
  cvcBtn = document.getElementById("cvc-button");
  
  musicBtn = document.getElementById("music-toggle");
}

/* ==============================
   WORD LISTS
================================ */

const vcWords = [
  "at","an","am","it","in","on","up",
  "ed","eg","em","en","et","ex",
  "ib","id","ig","im","ip","ix",
  "ob","od","og","om","op","ot",
  "ub","ud","ug","um","un","ut"
];

const cvWords = [
  "ma","pa","no","go","ba","da","fa","ga","ha","ka","la",
  "na","ra","sa","ta","va","ya",
  "be","de","he","ke","le","me","ne","pe","se","te","we",
  "bi","di","fi","hi","ki","li","mi","ni","pi","si","ti","vi",
  "bo","co","do","fo","ho","jo","lo","mo","po","so","to","yo",
  "bu","cu","du","fu","gu","hu","ju","lu","mu","nu","pu","ru","su","tu","vu"
];

const cvcWords = [
  "ant","bat","bee","bug","cat","cod","cow","cub","dog","elf","emu","fox","hen","hog","owl","pig","pug","pup","ram","rat","yak",
  "arm","ear","eye","jaw","leg","lip","rib","toe",
  "bun","egg","gum","ham","jam","nut","oat","pea","pie","tea","yam",
  "bag","bed","bow","box","bus","cab","can","cap","car","cot","cup","dot","fan","hat","jar","jet","jug","key","kit","lid","log","map","mat","mop","mug","net","pan","pen","pin","pot","rag","rod","rug","saw","sun","tag","tie","tin","top","toy","tub","van","web","wig","wok",
  "cry","cut","dig","eat","fix","fly","get","got","hid","hit","hop","hug","hum","jog","lay","let","lit","met","mix","nap","nod","pat","pop","put","ran","rub","run","sat","say","see","set","sew","sip","sit","ski","tap","try","tug","use","wag","win","won","zip",
  "bud","fog","hay","hot","ice","mud","sea","sky","wet",
  "boy","dad","guy","kid","lad","man","mom","pal","pet","son","tot",
  "bad","big","dim","dry","fat","fit","fun","gay","icy","joy","low","mad","new","odd","old","red","sad","shy","wow","yum",
  "few","one","six","ten","two",
  "den","gym","hut","inn","lab","spa","zoo",
  "did","end","gap","gas","had","has","her","hey","him","his","how","lot","not","now","oil","out","pay","row","she","sum","the","too","was","way","who","why","yes","yet","you",
  "fat","hat","mat","pat","rat","sat","vat",
  "dad","had","mad","pad","sad",
  "lag","tag",
  "sap",
  "fed","led","wed",
  "beg","peg",
  "men",
  "vet",
  "bin","din","fin","tin",
  "fig",
  "dip","hip",
  "cot","dog","hog","log",
  "fox",
  "sob",
  "job","rob"
];

let words = cvcWords;
let currentWord = "";
let letters = [];

/* ==============================
   AUDIO HELPERS
================================ */

function playLetter(letter) {
  if (!audioReady) return;
  const a = new Audio(`../../../assets/sounds/${letter}.mp3`);
  a.currentTime = 0;
  a.play().catch(() => {});
}

function speakWord(word) {
  if (!audioReady) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(word));
}

/* ==============================
   READING GUIDE FUNCTIONALITY
================================ */

let readingGuide;
let guideFinger;
let isDragging = false;
let fingerX = 0;

function initReadingGuide() {
  readingGuide = document.getElementById('reading-guide');
  guideFinger = document.querySelector('.guide-finger');
  
  if (!guideFinger) return;

  // Mouse events
  guideFinger.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);

  // Touch events
  guideFinger.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', stopDrag);
}

function startDrag(e) {
  e.preventDefault();
  isDragging = true;
  guideFinger.style.cursor = 'grabbing';
}

function drag(e) {
  if (!isDragging || !readingGuide || letters.length === 0) return;
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const wordDisplayRect = wordDisplay.getBoundingClientRect();
  
  // Calculate position relative to word display
  fingerX = clientX - wordDisplayRect.left;
  
  // Constrain to word display bounds
  fingerX = Math.max(0, Math.min(fingerX, wordDisplayRect.width));
  
  // Update finger position
  guideFinger.style.left = fingerX + 'px';
  
  // Check which letter is being pointed at
  letters.forEach((letterEl, index) => {
    const rect = letterEl.getBoundingClientRect();
    const letterCenter = rect.left + rect.width / 2 - wordDisplayRect.left;
    
    if (Math.abs(fingerX - letterCenter) < rect.width / 2) {
      if (!letterEl.classList.contains('word-jump')) {
        letterEl.classList.add('word-jump');
        const letter = currentWord[index];
        playLetter(letter);
        setTimeout(() => {
          letterEl.classList.remove('word-jump');
        }, 400);
      }
    }
  });
}

function stopDrag() {
  isDragging = false;
  if (guideFinger) {
    guideFinger.style.cursor = 'grab';
  }
}

function positionReadingGuide() {
  if (!readingGuide || !wordDisplay || letters.length === 0) return;
  
  const wordRect = wordDisplay.getBoundingClientRect();
  const firstLetter = letters[0].getBoundingClientRect();
  
  readingGuide.style.top = (firstLetter.top - 20) + 'px';
  readingGuide.style.left = wordRect.left + 'px';
  readingGuide.style.width = wordRect.width + 'px';
  readingGuide.classList.add('active');
  
  // Position finger at start
  if (guideFinger) {
    guideFinger.style.left = '0px';
    fingerX = 0;
  }
}

/* ==============================
   GAME LOGIC
================================ */

function renderWord(word) {
  currentWord = word;
  wordDisplay.innerHTML = "";
  letters = [];
  
  for (let letter of word) {
    const letterDiv = document.createElement("div");
    letterDiv.className = "letter";
    letterDiv.textContent = letter;
    letterDiv.onclick = () => playLetter(letter);
    wordDisplay.appendChild(letterDiv);
    letters.push(letterDiv);
  }
  
  setTimeout(positionReadingGuide, 100);
}

function randomWord() {
  const word = words[Math.floor(Math.random() * words.length)];
  renderWord(word);
}

function blendWord() {
  if (!currentWord) return;
  
  let delay = 0;
  for (let i = 0; i < currentWord.length; i++) {
    setTimeout(() => {
      letters[i].classList.add('word-jump');
      playLetter(currentWord[i]);
      setTimeout(() => {
        letters[i].classList.remove('word-jump');
      }, 400);
    }, delay);
    delay += 500;
  }
  
  setTimeout(() => {
    speakWord(currentWord);
  }, delay);
}

function setWordList(type) {
  // Remove active class from all buttons
  vcBtn.classList.remove('active');
  cvBtn.classList.remove('active');
  cvcBtn.classList.remove('active');
  
  // Set word list and activate button
  if (type === 'vc') {
    words = vcWords;
    vcBtn.classList.add('active');
  } else if (type === 'cv') {
    words = cvWords;
    cvBtn.classList.add('active');
  } else {
    words = cvcWords;
    cvcBtn.classList.add('active');
  }
  
  randomWord();
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  
  if (musicEnabled) {
    bgMusic.play().catch(() => {});
    musicBtn.textContent = "🔇 Music";
  } else {
    bgMusic.pause();
    musicBtn.textContent = "🎵 Music";
  }
}

/* ==============================
   EVENT LISTENERS
================================ */

document.addEventListener("DOMContentLoaded", () => {
  initDOM();
  initReadingGuide();
  
  if (newWordBtn) newWordBtn.onclick = randomWord;
  if (blendBtn) blendBtn.onclick = blendWord;
  if (vcBtn) vcBtn.onclick = () => setWordList('vc');
  if (cvBtn) cvBtn.onclick = () => setWordList('cv');
  if (cvcBtn) cvcBtn.onclick = () => setWordList('cvc');
  if (musicBtn) musicBtn.onclick = toggleMusic;
  
  // Start with CVC word
  randomWord();
});

// Handle window resize
window.addEventListener('resize', positionReadingGuide);

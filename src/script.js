/* ==============================
   AUDIO INITIALIZATION
================================ */

let audioReady = false;

// Auto-initialize audio on page load
function initializeAudio() {
  // Only run on home page (index.html), not on profile.html
  if (document.title.includes('Parent Profile') || document.location.pathname.includes('profile.html')) {
    return;
  }
  
  // unlock background music
  bgMusic.play()
    .then(() => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    })
    .catch(() => {});

  // unlock speech
  speechSynthesis.cancel();

  audioReady = true;
}

// Initialize audio when page is ready (only on home page)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAudio);
} else {
  initializeAudio();
}

/* ==============================
   BACKGROUND MUSIC
================================ */

const bgMusic = new Audio("assets/sounds/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

let musicEnabled = false;

/* ==============================
   DOM
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

let words = vcWords;
let currentWord = "";
let letters = [];

/* ==============================
   AUDIO HELPERS
================================ */

// Get API credentials from config
const elevenLabsApiKey = window.config?.elevenLabs?.apiKey || '';
const voiceId = window.config?.elevenLabs?.voiceId || '';

function playLetter(letter) {
  if (!audioReady) return;
  const a = new Audio(`assets/sounds/${letter}.mp3`);
  a.currentTime = 0;
  a.play().catch(() => {});
}

function speakWord(word) {
  if (!audioReady) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(word));
}

// Text-to-speech function for games
function speakText(text) {
  if (!audioReady) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(String(text)));
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
    tile.onclick = () => playLetter(letter);
    wordDisplay.appendChild(tile);
    letters.push(tile);
  });
}

function newWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  renderWord(currentWord);
  initReadingGuide();
}

/* ==============================
   READING GUIDE - FINGER TRACKER
================================ */

function initReadingGuide() {
  const guide = document.getElementById('reading-guide');
  const wordDisplay = document.getElementById('word-display');
  if (!guide || !wordDisplay) return;
  
  const finger = guide.querySelector('.guide-finger');
  let isDragging = false;
  let lastLetter = null;
  
  // Position guide to match word display bounds
  function positionGuide() {
    const letters = wordDisplay.querySelectorAll('.letter');
    if (letters.length === 0) return;
    
    const firstLetter = letters[0].getBoundingClientRect();
    const lastLetter = letters[letters.length - 1].getBoundingClientRect();
    const guideParent = guide.parentElement.getBoundingClientRect();
    
    // Calculate actual width from first to last letter
    const guideWidth = lastLetter.right - firstLetter.left;
    const guideLeft = firstLetter.left - guideParent.left;
    const guideTop = lastLetter.bottom - guideParent.top + 5;
    
    guide.style.left = guideLeft + 'px';
    guide.style.width = guideWidth + 'px';
    guide.style.top = guideTop + 'px';
    
    // Position finger at start of first letter (silent)
    finger.style.left = '0px';

    guide.classList.add('active');
  }
  
  // Find letter under finger position
  function getLetterUnderFinger(fingerX) {
    const letters = wordDisplay.querySelectorAll('.letter');
    for (let letter of letters) {
      const rect = letter.getBoundingClientRect();
      if (fingerX >= rect.left && fingerX <= rect.right) {
        return letter;
      }
    }
    return null;
  }
  
  positionGuide();
  window.addEventListener('resize', positionGuide);
  
  // Drag finger horizontally
  finger.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const displayRect = wordDisplay.getBoundingClientRect();
    const guideRect = guide.getBoundingClientRect();
    
    let x = e.clientX - guideRect.left;
    x = Math.max(0, Math.min(x, guideRect.width));
    finger.style.left = x + 'px';
    
    // Animate letter under finger
    const letter = getLetterUnderFinger(e.clientX);
    if (letter && letter !== lastLetter) {
      if (lastLetter) lastLetter.classList.remove('word-jump');
      letter.classList.add('word-jump');
      lastLetter = letter;
      setTimeout(() => letter.classList.remove('word-jump'), 400);
    }
    
    e.preventDefault();
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Touch support
  finger.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const displayRect = wordDisplay.getBoundingClientRect();
    const guideRect = guide.getBoundingClientRect();
    
    let x = e.touches[0].clientX - guideRect.left;
    x = Math.max(0, Math.min(x, guideRect.width));
    finger.style.left = x + 'px';
    
    // Animate letter under finger
    const letter = getLetterUnderFinger(e.touches[0].clientX);
    if (letter && letter !== lastLetter) {
      if (lastLetter) lastLetter.classList.remove('word-jump');
      letter.classList.add('word-jump');
      lastLetter = letter;
      setTimeout(() => letter.classList.remove('word-jump'), 400);
    }
    
    e.preventDefault();
  });
  
  document.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==============================
   EVENTS
================================ */

function setupPhonicsEvents() {
  if (!newWordBtn || !blendBtn || !vcBtn || !cvBtn || !cvcBtn || !musicBtn) {
    return; // Elements not found, not on phonics page
  }

  blendBtn.onclick = () => speakWord(currentWord);
  newWordBtn.onclick = newWord;

  vcBtn.onclick = () => { words = vcWords; newWord(); };
  cvBtn.onclick = () => { words = cvWords; newWord(); };
  cvcBtn.onclick = () => { words = cvcWords; newWord(); };

  musicBtn.onclick = () => {
    if (!audioReady) return;

    if (musicEnabled) {
      bgMusic.pause();
      musicEnabled = false;
      musicBtn.textContent = "🎵 Music";
    } else {
      bgMusic.play().catch(() => {});
      musicEnabled = true;
      musicBtn.textContent = "⏸ Music";
    }
  };

  // Load first word
  newWord();
}

/* ==============================
   INITIALIZATION
================================ */

function setupPhonics() {
  // Initialize DOM elements
  initDOM();
  
  // Only set up if on phonics page
  if (!newWordBtn || !blendBtn) return;

  blendBtn.onclick = () => speakWord(currentWord);
  newWordBtn.onclick = newWord;

  vcBtn.onclick = () => { words = vcWords; newWord(); };
  cvBtn.onclick = () => { words = cvWords; newWord(); };
  cvcBtn.onclick = () => { words = cvcWords; newWord(); };

  musicBtn.onclick = () => {
    if (!audioReady) return;

    if (musicEnabled) {
      bgMusic.pause();
      musicEnabled = false;
      musicBtn.textContent = "🎵 Music";
    } else {
      bgMusic.play().catch(() => {});
      musicEnabled = true;
      musicBtn.textContent = "⏸ Music";
    }
  };

  // Load first word
  newWord();
}

// Wait for DOM to be ready before setting up phonics
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupPhonics);
} else {
  setupPhonics();
}

/* ==============================
   KID MANAGEMENT
================================ */

// Store current selected kid globally
let currentSelectedKidId = null;

// Populate kid selector dropdown
function populateKidSelector() {
  const selector = document.getElementById('kid-selector');
  if (!selector) return;
  
  // Get all kids from parent's account
  const kids = (window.userData && window.userData.kids) || [];
  
  // Clear existing options
  selector.innerHTML = '<option value="">Select a kid...</option>';
  
  kids.forEach(kid => {
    const option = document.createElement('option');
    option.value = kid.id;
    option.textContent = kid.name;
    selector.appendChild(option);
  });
  
  // Load saved kid selection from localStorage
  const savedKidId = localStorage.getItem('selectedKidId');
  if (savedKidId && kids.some(k => k.id === savedKidId)) {
    selector.value = savedKidId;
    currentSelectedKidId = savedKidId;
  }
}

// Handle kid selection change
function selectKidForGame() {
  const selector = document.getElementById('kid-selector');
  const kidId = selector.value;
  
  if (kidId) {
    currentSelectedKidId = kidId;
    localStorage.setItem('selectedKidId', kidId);
    
    // Show confirmation
    const kids = window.userData.kids || [];
    const selectedKid = kids.find(k => k.id === kidId);
    if (selectedKid) {
      console.log(`Now playing as: ${selectedKid.name}`);
      // Optional: Show toast notification
    }
  }
}

// Get current selected kid
function getCurrentSelectedKidId() {
  return currentSelectedKidId;
}

/* ==============================
   START
================================ */

newWord();
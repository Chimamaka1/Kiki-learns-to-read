/* ==============================
   LETTERS & PHONICS GAME V2
   WITH LEVELS, THEMES & BUDDIES
================================ */

/* ==============================
   GAME STATE
================================ */

let gameState = {
  currentLevel: 1,
  currentBuddy: 'kiki',
  currentTheme: 'jungle',
  musicEnabled: false,
  sessionStart: null,
  sessionStats: {
    wordsAttempted: 0,
    wordsCompleted: 0,
    blendUsed: 0,
    letterTaps: {},
    wordTimes: []
  }
};

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

/* ==============================
   DOM ELEMENTS
================================ */

let wordDisplay;
let newWordBtn;
let blendBtn;
let musicBtn;
let letterGrid;
let gameContainer;
let gameHeader;
let welcomeScreen;

function initDOM() {
  wordDisplay = document.getElementById("word-display");
  newWordBtn = document.getElementById("new-word-button");
  blendBtn = document.getElementById("blend-word-button");
  musicBtn = document.getElementById("music-toggle");
  letterGrid = document.getElementById("letter-grid");
  gameContainer = document.getElementById("game-container");
  gameHeader = document.getElementById("game-header");
  welcomeScreen = document.getElementById("welcome-screen");
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

let currentWords = [];
let currentWord = "";
let letters = [];
let wordStartTime = 0;

/* ==============================
   AUDIO HELPERS
================================ */

function playLetter(letter) {
  if (!audioReady) return;
  const a = new Audio(`../../../assets/sounds/${letter.toLowerCase()}.mp3`);
  a.currentTime = 0;
  a.play().catch(() => {});
  
  // Track letter taps
  if (!gameState.sessionStats.letterTaps[letter]) {
    gameState.sessionStats.letterTaps[letter] = 0;
  }
  gameState.sessionStats.letterTaps[letter]++;
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
  gameState.musicEnabled = !gameState.musicEnabled;
  
  if (gameState.musicEnabled) {
    bgMusic.play().catch(() => {});
    musicBtn.textContent = "🔇 Music";
  } else {
    bgMusic.pause();
    musicBtn.textContent = "🎵 Music";
  }
}

/* ==============================
   LEVEL SELECTION & SETUP
================================ */

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function selectBuddy(buddy) {
  gameState.currentBuddy = buddy;
  document.querySelectorAll('.buddy-option').forEach(el => el.classList.remove('active'));
  document.querySelector(`[data-buddy="${buddy}"]`).classList.add('active');
}

function selectTheme(theme) {
  gameState.currentTheme = theme;
  document.querySelectorAll('.theme-option').forEach(el => el.classList.remove('active'));
  document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
  
  // Apply theme
  document.body.className = `theme-${theme}`;
}

function startGame(level) {
  gameState.currentLevel = level;
  gameState.sessionStart = Date.now();
  gameState.sessionStats = {
    wordsAttempted: 0,
    wordsCompleted: 0,
    blendUsed: 0,
    letterTaps: {},
    wordTimes: []
  };
  
  // Hide welcome screen, show game
  welcomeScreen.classList.remove('active');
  gameHeader.style.display = 'flex';
  gameContainer.style.display = 'block';
  
  // Update header
  updateHeader();
  
  // Set up level
  if (level === 1) {
    setupLevel1();
  } else if (level === 2) {
    setupLevel2();
  } else if (level === 3) {
    setupLevel3();
  } else if (level === 4) {
    setupLevel4();
  }
}

function updateHeader() {
  const buddyEmojis = {
    'kiki': '🧑‍🦰',
    'tiger': '🐯',
    'robot': '🤖',
    'star': '⭐'
  };
  
  const levelNames = ['', 'A-Z Letters', 'VC Words', 'CV Words', 'CVC Words'];
  
  document.getElementById('buddy-display').textContent = `${buddyEmojis[gameState.currentBuddy]} ${gameState.currentBuddy.charAt(0).toUpperCase() + gameState.currentBuddy.slice(1)}`;
  document.getElementById('level-badge').textContent = `Level ${gameState.currentLevel}`;
  document.getElementById('game-subtitle').textContent = `📚 ${levelNames[gameState.currentLevel]}`;
}

/* ==============================
   LEVEL SETUP FUNCTIONS
================================ */

function setupLevel1() {
  document.getElementById('level-1-content').style.display = 'block';
  document.getElementById('level-2-4-content').style.display = 'none';
  document.getElementById('phonics-options').style.display = 'none';
  document.getElementById('game-instruction').textContent = 'Tap any letter to hear its sound!';
  
  letterGrid.innerHTML = '';
  alphabet.forEach(letter => {
    const letterEl = document.createElement('div');
    letterEl.className = 'grid-letter';
    letterEl.textContent = letter;
    letterEl.onclick = () => {
      letterEl.classList.add('bounce');
      playLetter(letter);
      setTimeout(() => letterEl.classList.remove('bounce'), 600);
    };
    letterGrid.appendChild(letterEl);
  });
}

function setupLevel2() {
  currentWords = vcWords;
  document.getElementById('level-1-content').style.display = 'none';
  document.getElementById('level-2-4-content').style.display = 'block';
  document.getElementById('phonics-options').style.display = 'flex';
  document.getElementById('game-instruction').textContent = 'Tap letters to hear sounds. Use Blend to hear the whole word!';
  
  renderRandomWord();
}

function setupLevel3() {
  currentWords = cvWords;
  document.getElementById('level-1-content').style.display = 'none';
  document.getElementById('level-2-4-content').style.display = 'block';
  document.getElementById('phonics-options').style.display = 'flex';
  document.getElementById('game-instruction').textContent = 'Tap letters to hear sounds. Use Blend to hear the whole word!';
  
  renderRandomWord();
}

function setupLevel4() {
  currentWords = cvcWords;
  document.getElementById('level-1-content').style.display = 'none';
  document.getElementById('level-2-4-content').style.display = 'block';
  document.getElementById('phonics-options').style.display = 'flex';
  document.getElementById('game-instruction').textContent = 'Tap letters to hear sounds. Use Blend to hear the whole word!';
  
  renderRandomWord();
}

/* ==============================
   WORD RENDERING
================================ */

function renderRandomWord() {
  if (currentWords.length === 0) return;
  
  const word = currentWords[Math.floor(Math.random() * currentWords.length)];
  wordStartTime = Date.now();
  gameState.sessionStats.wordsAttempted++;
  
  renderWord(word);
}

function renderWord(word) {
  currentWord = word;
  wordDisplay.innerHTML = "";
  letters = [];
  
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    const letterDiv = document.createElement("div");
    letterDiv.className = "letter";
    letterDiv.textContent = letter.toUpperCase();
    
    // Random animation on render
    const animations = ['spin', 'pulse', 'jump'];
    const randomAnim = animations[Math.floor(Math.random() * animations.length)];
    letterDiv.classList.add(randomAnim);
    setTimeout(() => letterDiv.classList.remove(randomAnim), 600);
    
    letterDiv.onclick = () => {
      letterDiv.classList.add('pulse');
      playLetter(letter);
      setTimeout(() => letterDiv.classList.remove('pulse'), 500);
    };
    
    wordDisplay.appendChild(letterDiv);
    letters.push(letterDiv);
  }
}

function blendWord() {
  if (!currentWord) return;
  
  gameState.sessionStats.blendUsed++;
  
  let delay = 0;
  for (let i = 0; i < currentWord.length; i++) {
    setTimeout(() => {
      letters[i].classList.add('jump');
      playLetter(currentWord[i]);
      setTimeout(() => {
        letters[i].classList.remove('jump');
      }, 600);
    }, delay);
    delay += 600;
  }
  
  setTimeout(() => {
    speakWord(currentWord);
  }, delay);
}

/* ==============================
   NAVIGATION & MENU
================================ */

function goHome() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#reading-section';
}

function goBackToReading() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#reading-section';
}

function toggleMenu() {
  const menu = document.getElementById('pause-menu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function showMenu() {
  document.getElementById('pause-menu').style.display = 'block';
}

function showLevelSelect() {
  toggleMenu();
  // Hide game, show welcome screen with level selection
  gameHeader.style.display = 'none';
  gameContainer.style.display = 'none';
  welcomeScreen.classList.add('active');
}

function showSettings() {
  toggleMenu();
  // Would show settings modal
}

/* ==============================
   GAME INFO MODAL FUNCTIONS
================================ */

function closeInfoModal() {
  const modal = document.getElementById('game-info-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function showInfoTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll('.info-tab-content');
  tabContents.forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all buttons
  const tabButtons = document.querySelectorAll('.info-tab-btn');
  tabButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab content
  const selectedContent = document.getElementById(`${tabName}-tab`);
  if (selectedContent) {
    selectedContent.classList.add('active');
  }
  
  // Mark button as active
  const selectedBtn = document.querySelector(`[onclick="showInfoTab('${tabName}')"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('active');
  }
}

function showInfoModal() {
  const modal = document.getElementById('game-info-modal');
  if (modal) {
    modal.classList.add('active');
    // Show first tab by default
    showInfoTab('objective');
  }
}

/* ==============================
   INITIALIZATION
================================ */

document.addEventListener("DOMContentLoaded", () => {
  initDOM();
  
  // Set default theme
  selectTheme('jungle');
  
  // Show game info modal on first load
  showInfoModal();
  
  // Event listeners for game controls
  if (newWordBtn) newWordBtn.onclick = renderRandomWord;
  if (blendBtn) blendBtn.onclick = blendWord;
  if (musicBtn) musicBtn.onclick = toggleMusic;
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('pause-menu');
    const menuContent = document.querySelector('.menu-content');
    if (menu && menu.style.display === 'block' && !menuContent.contains(e.target) && !e.target.closest('.menu-button')) {
      menu.style.display = 'none';
    }
  });
});

// Handle window resize
window.addEventListener('resize', () => {
  // Reposition elements if needed
});

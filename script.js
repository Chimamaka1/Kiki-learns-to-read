/* ==============================
   AUDIO GATE (iPAD / iOS SAFE)
================================ */

let audioReady = false;

const startBtn = document.getElementById("start-audio");
const audioGate = document.getElementById("audio-gate");

startBtn.onclick = () => {
  // unlock sound effects
  //const test = new Audio("assets/sounds/a.mp3");
  //test.play().catch(() => {});

  // unlock background music (IMPORTANT)
  bgMusic.play()
    .then(() => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    })
    .catch(() => {});

  // unlock speech
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance("Let's read!"));

  audioReady = true;
  audioGate.style.display = "none";
};

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

const wordDisplay = document.getElementById("word-display");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");

const vcBtn = document.getElementById("vc-button");
const cvBtn = document.getElementById("cv-button");
const cvcBtn = document.getElementById("cvc-button");

const musicBtn = document.getElementById("music-toggle");

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

async function speakWord(word) {
  if (!audioReady) return;
  
  // Check if ElevenLabs credentials are available
  if (!elevenLabsApiKey || !voiceId) {
    console.warn('ElevenLabs credentials not configured, using fallback speech synthesis');
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(word));
    return;
  }
  
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey
      },
      body: JSON.stringify({
        text: word,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch(() => {});
      
      // Clean up the object URL after playback
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } else {
      // Fallback to speech synthesis if ElevenLabs fails
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(word));
    }
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    // Fallback to speech synthesis
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(word));
  }
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
    
    // Position finger at start of first letter
    finger.style.left = '0px';
    
    // Trigger first letter on init
    playLetter(letters[0].textContent);
    
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
      playLetter(letter.textContent);
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
      playLetter(letter.textContent);
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

/* ==============================
   START
================================ */

newWord();

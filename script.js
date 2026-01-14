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
const slider = document.getElementById("blend-slider");
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
  "bat","cat","fat","hat","mat","pat","rat","sat","vat",
  "bad","dad","had","mad","pad","sad",
  "bag","lag","rag","tag","wag",
  "cap","gap","lap","map","nap","sap","tap","zap",
  "jam","ham","ram","yam",
  "man","fan","can","pan","ran","tan",
  "bed","fed","led","red","wed",
  "beg","leg","peg",
  "hen","men","pen","ten","den",
  "jet","net","pet","vet","get",
  "bin","din","fin","pin","tin","win",
  "big","dig","fig","pig","wig",
  "hit","kit","lit","pit","sit","fit",
  "lip","sip","dip","hip","tip",
  "mix","six","fix",
  "cot","dot","hot","lot","not","pot","rot",
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
  const i = Number(slider.value);
  letters.forEach(l => l.classList.remove("active"));
  letters[i]?.classList.add("active");
};

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

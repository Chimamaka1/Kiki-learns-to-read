/* =========================
   LISTEN & CHOOSE (PHONICS)
========================= */

const words = ["bat","cat","fat","hat","mat","pat","rat","sat","vat",
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

const playBtn = document.getElementById("play-word");
const choicesDiv = document.getElementById("choices");
const nextBtn = document.getElementById("next-question");
const reward = document.getElementById("reward");

let correctWord = "";
let currentAudio = null; // Track current playing audio

/* ---------- SPEAK FULL WORD ---------- */
async function speakWord(word) {
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  
  // Get API credentials from config
  const elevenLabsApiKey = window.config?.elevenLabs?.apiKey || '';
  const voiceId = window.config?.elevenLabs?.voiceId || '';
  
  // Check if ElevenLabs credentials are available
  if (!elevenLabsApiKey || !voiceId) {
    // Fallback to speech synthesis
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.rate = 0.8;
    utter.pitch = 1.2;
    speechSynthesis.speak(utter);
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
      currentAudio = audio; // Track this audio
      
      audio.play().catch(() => {});
      
      // Clean up when audio ends or stops
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (currentAudio === audio) currentAudio = null;
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        if (currentAudio === audio) currentAudio = null;
      };
    } else {
      // Fallback to speech synthesis if ElevenLabs fails
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.rate = 0.8;
      utter.pitch = 1.2;
      speechSynthesis.speak(utter);
    }
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    // Fallback to speech synthesis
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.rate = 0.8;
    utter.pitch = 1.2;
    speechSynthesis.speak(utter);
  }
}

/* ---------- PLAY SINGLE LETTER ---------- */
function playLetter(letter) {
  const audio = new Audio(`../../assets/sounds/${letter}.mp3`);
  audio.play().catch(() => {});
}

/* ---------- REWARD ---------- */
function showReward() {
  reward.classList.remove("hidden");
  setTimeout(() => reward.classList.add("hidden"), 1200);
}

/* ---------- NEW QUESTION ---------- */
function newQuestion() {
  choicesDiv.innerHTML = "";

  // choose target word
  correctWord = words[Math.floor(Math.random() * words.length)];

  // build options
  let options = [correctWord];
  while (options.length < 3) {
    const w = words[Math.floor(Math.random() * words.length)];
    if (!options.includes(w)) options.push(w);
  }

  options.sort(() => Math.random() - 0.5);

  options.forEach(word => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "word-option";

    /* --- LETTER TILES (LISTEN ONLY) --- */
    const lettersDiv = document.createElement("div");
    lettersDiv.className = "letters";

    [...word].forEach(letter => {
      const tile = document.createElement("div");
      tile.className = "letter-tile";
      tile.textContent = letter;

      tile.onclick = () => playLetter(letter);

      lettersDiv.appendChild(tile);
    });

    /* --- CHOOSE BUTTON (ANSWER) --- */
    const chooseBtn = document.createElement("button");
    chooseBtn.className = "choose-btn";
    chooseBtn.textContent = "Choose";

    chooseBtn.onclick = () => {
      if (word === correctWord) {
        showReward();
        speakWord("Well done");
      } else {
        speakWord("Try again");
      }
    };

    optionDiv.appendChild(lettersDiv);
    optionDiv.appendChild(chooseBtn);
    choicesDiv.appendChild(optionDiv);
  });

  // auto-play the target word
  setTimeout(() => speakWord(correctWord), 600);
}

/* ---------- EVENTS ---------- */
playBtn.onclick = () => speakWord(correctWord);
nextBtn.onclick = newQuestion;

/* ---------- START ---------- */
newQuestion();

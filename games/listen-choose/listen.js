/* =========================
   LISTEN & CHOOSE (PHONICS)
========================= */

// Phonics CVC words (kid-friendly selection)
const cvcWords = [
  "bat","cat","hat","mat","sat",
  "bad","dad","had","mad","pad","sad",
  "bag","tag","wag",
  "cap","lap","map","nap","tap",
  "jam","ham",
  "man","fan","pan","ran","tan",
  "bed","red",
  "hen","pen","ten",
  "jet","pet","vet",
  "bin","pin","win",
  "big","pig",
  "sit","fit",
  "lip","sip","dip",
  "six","fix",
  "cot","dot","hot","lot","not","pot",
  "dog","log",
  "box","fox",
  "top","mop","hop","pop",
  "bug","hug","jug","mug","rug",
  "fun","run","sun",
  "cup","pup","tub","rub",
  "mud","bud"
];

// Tricky sight words (Pre‑Primer/Primer focus)
const trickyWords = [
  "the","to","and","a","I","you","it","in","is","we","me","be","go","no","so",
  "he","she","was","said","are","come","some","here","there","where",
  "want","have","do","for","my","not","one","two","up","see","look","play"
];

// Smart distractors (kept simple for young readers)
const trickyDistractors = {
  to: ["too","two"],
  the: ["then","tee"],
  was: ["has","saw"],
  said: ["sad","say"],
  are: ["our","or"],
  you: ["u","yoo"],
  come: ["some","cone"],
  some: ["come","sum"],
  have: ["has"],
  here: ["hear","there"],
  there: ["here","where"],
  where: ["were","here"],
  do: ["to","go"],
  for: ["four","far"],
  one: ["two","on"],
  two: ["to","too"],
  see: ["sea"],
  look: ["lock","book"],
};

const playBtn = document.getElementById("play-word");
const choicesDiv = document.getElementById("choices");
const nextBtn = document.getElementById("next-question");
const reward = document.getElementById("reward");
const modeSelect = document.getElementById("mode");

let correctWord = "";
let mode = (modeSelect && modeSelect.value) || "cvc";
let reviewQueue = []; // simple spaced repetition: requeue missed words
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
function pickTarget() {
  if (mode === "tricky") {
    // If we have missed items queued, surface them first
    if (reviewQueue.length > 0 && Math.random() < 0.6) {
      return reviewQueue.shift();
    }
    return trickyWords[Math.floor(Math.random() * trickyWords.length)];
  }
  // default CVC
  return cvcWords[Math.floor(Math.random() * cvcWords.length)];
}

function buildOptions(target) {
  const opts = new Set([target]);
  if (mode === "tricky") {
    const confusers = trickyDistractors[target] || [];
    // Add up to 2 confusers
    confusers.forEach(c => { if (opts.size < 3) opts.add(c); });
    // Fill remaining with other tricky words
    while (opts.size < 3) {
      const w = trickyWords[Math.floor(Math.random() * trickyWords.length)];
      if (!opts.has(w)) opts.add(w);
    }
  } else {
    // CVC: random other words
    while (opts.size < 3) {
      const w = cvcWords[Math.floor(Math.random() * cvcWords.length)];
      if (!opts.has(w)) opts.add(w);
    }
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

function newQuestion() {
  choicesDiv.innerHTML = "";

  // choose target word
  correctWord = pickTarget();

  // build options
  const options = buildOptions(correctWord);

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
        // Requeue missed target for spaced repetition
        reviewQueue.push(correctWord);
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
if (modeSelect) {
  modeSelect.onchange = () => {
    mode = modeSelect.value;
    reviewQueue = [];
    newQuestion();
  };
}

/* ---------- START ---------- */
newQuestion();

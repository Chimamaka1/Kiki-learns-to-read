/* =========================
   CRACK THE EGG – IMAGE MATCH
========================= */

// Function to generate canvas-based placeholder images
function generatePlaceholderImage(emoji, word, bgColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 300, 300);

  // Emoji
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 150, 140);

  // Word
  ctx.fillStyle = 'white';
  ctx.font = 'bold 32px Arial';
  ctx.fillText(word.toUpperCase(), 150, 250);

  return canvas.toDataURL('image/png');
}

const items = [
  { word: "dog", img: generatePlaceholderImage('🐕', 'dog', '#ff6b6b') },
  { word: "sun", img: generatePlaceholderImage('☀️', 'sun', '#ffd93d') },
  { word: "hat", img: generatePlaceholderImage('🎩', 'hat', '#a29bfe') },
  { word: "bed", img: generatePlaceholderImage('🛏️', 'bed', '#74b9ff') },
  { word: "car", img: generatePlaceholderImage('🚗', 'car', '#ff7675') },
  { word: "tree", img: generatePlaceholderImage('🌳', 'tree', '#55efc4') },
  { word: "ball", img: generatePlaceholderImage('⚽', 'ball', '#fdcb6e') },
  { word: "book", img: generatePlaceholderImage('📚', 'book', '#6c5ce7') },
  { word: "star", img: generatePlaceholderImage('⭐', 'star', '#ffeaa7') },
  { word: "apple", img: generatePlaceholderImage('🍎', 'apple', '#ff6348') },
  { word: "house", img: generatePlaceholderImage('🏠', 'house', '#fd79a8') },
  { word: "fish", img: generatePlaceholderImage('🐟', 'fish', '#74b9ff') },
  { word: "bird", img: generatePlaceholderImage('🐦', 'bird', '#81ecec') },
  { word: "moon", img: generatePlaceholderImage('🌙', 'moon', '#a29bfe') }
];

const egg = document.getElementById("egg");
const eggImage = document.getElementById("egg-image");
const choicesDiv = document.getElementById("choices");
const playBtn = document.getElementById("play-word");
const nextBtn = document.getElementById("next");
const reward = document.getElementById("reward");

let correctWord = "";
let cracked = false;
let crackCount = 0;
const totalCracks = 3;

/* ---------- SPEAK ---------- */
async function speakWord(word) {
  // Get API credentials from config
  const elevenLabsApiKey = window.config?.elevenLabs?.apiKey || '';
  const voiceId = window.config?.elevenLabs?.voiceId || '';
  
  // Check if ElevenLabs credentials are available
  if (!elevenLabsApiKey || !voiceId) {
    // Fallback to speech synthesis
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.7;
    u.pitch = 1.1;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
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
      const u = new SpeechSynthesisUtterance(word);
      u.rate = 0.7;
      u.pitch = 1.1;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    // Fallback to speech synthesis
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.7;
    u.pitch = 1.1;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
}

/* ---------- REWARD ---------- */
function showReward() {
  reward.classList.remove("hidden");
  setTimeout(() => reward.classList.add("hidden"), 1200);
}

/* ---------- NEW ROUND ---------- */
function newRound() {
  cracked = false;
  crackCount = 0;
  choicesDiv.innerHTML = "";
  egg.classList.remove("cracked");
  egg.classList.remove("crack-1");
  egg.classList.remove("crack-2");
  egg.classList.remove("crack-3");
  eggImage.classList.add("hidden");

  const item = items[Math.floor(Math.random() * items.length)];
  correctWord = item.word;
  eggImage.src = item.img;
  eggImage.alt = correctWord;

  let options = [correctWord];
  while (options.length < 3) {
    const w = items[Math.floor(Math.random() * items.length)].word;
    if (!options.includes(w)) options.push(w);
  }

  options.sort(() => Math.random() - 0.5);

  options.forEach(word => {
    const btn = document.createElement("div");
    btn.className = "word-choice";
    btn.textContent = word;

    btn.onclick = () => {
      speakWord(word);
      if (word === correctWord) {
        showReward();
      } else {
        setTimeout(() => speakWord("Try again"), 800);
      }
    };

    choicesDiv.appendChild(btn);
  });
}

/* ---------- CRACK EGG ---------- */
egg.onclick = () => {
  if (cracked) return;

  crackCount++;
  
  // Add progressive crack classes
  if (crackCount === 1) {
    egg.classList.add("crack-1");
    const crackSound = new Audio();
    crackSound.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjCN1/POejMGI3bI8dyOOwkTXbPr7KthHAU+mdz11oEtBSN0yPDej0IACVGZ4fG+aiQGMYzX8tF3KwUid8rx3I5ACRRasuvxlj0JE1yw6+u0ZR0GOZXb88p3LgUke8jw3I1AChVbtOvqm1kUCkqY3/K/bCIGMYzY89F3KwkccsjxypA+CxNarevsuV8cBDiU2vO6dysFJHvH8NuPPQoVXLXr';
    crackSound.play().catch(() => {});
  } else if (crackCount === 2) {
    egg.classList.add("crack-2");
  } else if (crackCount >= totalCracks) {
    cracked = true;
    egg.classList.add("crack-3");
    egg.classList.add("cracked");

    setTimeout(() => {
      eggImage.classList.remove("hidden");
      speakWord(correctWord);
    }, 400);
  }
};

/* ---------- EVENTS ---------- */
playBtn.onclick = () => speakWord(correctWord);
nextBtn.onclick = newRound;

/* ---------- START ---------- */
newRound();

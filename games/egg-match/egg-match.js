/* =========================
   CRACK THE EGG – IMAGE MATCH
========================= */

const items = [
  { word: "cat", img: "../../assets/images/cat.png" },
  { word: "dog", img: "../../assets/images/dog.png" },
  { word: "sun", img: "../../assets/images/sun.png" },
  { word: "hat", img: "../../assets/images/hat.png" },
  { word: "bed", img: "../../assets/images/bed.png" }
];

const egg = document.getElementById("egg");
const eggImage = document.getElementById("egg-image");
const choicesDiv = document.getElementById("choices");
const playBtn = document.getElementById("play-word");
const nextBtn = document.getElementById("next");
const reward = document.getElementById("reward");

let correctWord = "";
let cracked = false;

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
  choicesDiv.innerHTML = "";
  egg.classList.remove("cracked");
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

  cracked = true;
  egg.classList.add("cracked");

  setTimeout(() => {
    eggImage.classList.remove("hidden");
    speakWord(correctWord);
  }, 400);
};

/* ---------- EVENTS ---------- */
playBtn.onclick = () => speakWord(correctWord);
nextBtn.onclick = newRound;

/* ---------- START ---------- */
newRound();

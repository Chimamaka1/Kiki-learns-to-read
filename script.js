document.addEventListener("DOMContentLoaded", () => {
  // ----- DOM -----
  const wordDisplay = document.getElementById("word-display");
  const newWordBtn = document.getElementById("new-word-button");
  const blendBtn = document.getElementById("blend-word-button");
  const slider = document.getElementById("blend-slider");

  // ----- CVC WORDS (expand any time) -----
  const words = [
    "cat","bat","rat","mat","sat","hat","map","jam","cap","lap",
    "bed","red","pen","hen","net","jet","pet","leg","den","get",
    "sit","pit","hit","bit","fit","kit","dig","pig","wig","fig",
    "dog","log","fog","hot","pot","top","box","fox","rod","dot",
    "sun","fun","run","bun","hug","bug","cup","cut","nut","mud"
  ];

  // ----- STATE -----
  let currentWord = "";
  let tiles = [];
  let lastSliderValue = 0;

  // ----- AUDIO HELPERS -----
  const letterAudioCache = new Map();

  function getLetterAudio(letter) {
    const key = letter.toLowerCase();
    if (!letterAudioCache.has(key)) {
      const a = new Audio(`sounds_clean/${key}.mp3`);
      a.preload = "auto";
      letterAudioCache.set(key, a);
    }
    return letterAudioCache.get(key);
  }

  function stopAllLetterAudio() {
    for (const a of letterAudioCache.values()) {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {}
    }
  }

  // Plays the phonics MP3 for a letter
  function playPhonic(letter) {
    stopAllLetterAudio(); // prevents overlap/jumpiness
    const a = getLetterAudio(letter);
    try {
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {}
  }

  // Whole word at end (TTS fallback)
  function speakWholeWord(word) {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.rate = 0.7; // slower for kids
      speechSynthesis.speak(u);
    } catch {}
  }

  // ----- RENDER WORD AS TILES -----
  function renderWord(word) {
    wordDisplay.innerHTML = "";
    tiles = [];

    [...word].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = ch;

      span.addEventListener("click", () => playPhonic(ch));

      wordDisplay.appendChild(span);
      tiles.push(span);
    });

    slider.value = 0;
    slider.max = tiles.length; // IMPORTANT
    lastSliderValue = 0;
  }

  // ----- NEW WORD -----
  function newWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    renderWord(currentWord);
  }

  newWordBtn.addEventListener("click", newWord);

  // ----- SLIDER BLENDING (finger slide) -----
  slider.addEventListener("input", () => {
    const value = Number(slider.value);

    tiles.forEach((t, i) => t.classList.toggle("active", i === value - 1));

    // only play when moving forward
    if (value > lastSliderValue && value >= 1 && value <= currentWord.length) {
      playPhonic(currentWord[value - 1]);
    }
    lastSliderValue = value;
  });

  // ----- BLEND WORD BUTTON (slow → whole word) -----
  blendBtn.addEventListener("click", async () => {
    if (!currentWord) return;

    // reset
    slider.value = 0;
    lastSliderValue = 0;
    tiles.forEach((t) => t.classList.remove("active"));

    // play each phoneme slowly
    for (let i = 0; i < currentWord.length; i++) {
      tiles.forEach((t) => t.classList.remove("active"));
      tiles[i].classList.add("active");
      slider.value = i + 1;

      playPhonic(currentWord[i]);
      await new Promise((r) => setTimeout(r, 750)); // slower blend pace
    }

    // then whole word
    await new Promise((r) => setTimeout(r, 450));
    speakWholeWord(currentWord);
  });

  // Start with a word so tiles always show
  newWord();
});

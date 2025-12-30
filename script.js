document.addEventListener("DOMContentLoaded", () => {

  // ----- ELEMENTS -----
  const wordDisplay = document.getElementById("word-display");
  const newWordBtn = document.getElementById("new-word-button");
  const blendBtn = document.getElementById("blend-word-button");
  const slider = document.getElementById("blend-slider");

  // ----- WORD LIST -----
  const words = [
    "cat","bat","rat","mat","sat","hat","map","jam","cap","lap",
    "bed","red","pen","hen","net","jet","pet","leg",
    "sit","pit","hit","bit","fit","kit","dig","pig","wig",
    "dog","log","fog","hot","pot","top","box","fox",
    "sun","fun","run","bun","hug","bug","cup","cut","nut"
  ];

  let currentWord = "";
  let lastSliderValue = 0;

  // ----- AUDIO -----
  function playLetter(letter) {
    const audio = new Audio(`sounds_clean/${letter}.mp3`);
    audio.play().catch(() => {});
  }

  function speakWholeWord(word) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.55;
    speechSynthesis.speak(u);
  }

  // ----- RENDER WORD AS TILES -----
  function renderWord(word) {
    wordDisplay.innerHTML = "";

    word.split("").forEach(letter => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = letter;

      span.addEventListener("click", () => playLetter(letter));
      wordDisplay.appendChild(span);
    });

    slider.value = 0;
    slider.max = word.length;
    lastSliderValue = 0;
  }

  // ----- NEW WORD -----
  function newWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    renderWord(currentWord);
  }

  newWordBtn.addEventListener("click", newWord);

  // ----- SLIDER BLEND -----
  slider.addEventListener("input", () => {
    const tiles = document.querySelectorAll(".letter");
    const value = Number(slider.value);

    tiles.forEach((t, i) => {
      t.style.backgroundColor = i < value ? "#ffe599" : "#e6f2ff";
    });

    if (value > lastSliderValue && tiles[value - 1]) {
      playLetter(tiles[value - 1].textContent);
    }

    lastSliderValue = value;
  });

  // ----- BUTTON BLEND (SLOW → WHOLE WORD) -----
  blendBtn.addEventListener("click", () => {
    const tiles = document.querySelectorAll(".letter");
    let i = 0;

    const interval = setInterval(() => {
      if (i < tiles.length) {
        playLetter(tiles[i].textContent);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => speakWholeWord(currentWord), 600);
      }
    }, 700);
  });

  // 🔑 FORCE FIRST WORD ON LOAD
  newWord();

});

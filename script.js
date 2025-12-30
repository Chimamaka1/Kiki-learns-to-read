document.addEventListener("DOMContentLoaded", () => {
  /* ---------- GET ELEMENTS ---------- */
  const wordDisplay = document.getElementById("word-display");
  const newWordButton = document.getElementById("new-word-button");
  const blendButton = document.getElementById("blend-word-button");
  const slider = document.getElementById("blend-slider");

  // SAFETY CHECK (IMPORTANT)
  if (!wordDisplay || !newWordButton || !blendButton || !slider) {
    alert("HTML elements missing. Check IDs.");
    return;
  }

  /* ---------- WORDS ---------- */
  const words = ["cat", "sun", "man", "log", "pin", "cup"];
  let currentWord = "";

  /* ---------- AUDIO ---------- */
  function playLetter(letter) {
    const audio = new Audio(`sounds_clean/${letter}.mp3`);
    audio.play().catch(() => {});
  }

  function speakWord() {
    if (!currentWord) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentWord);
    u.rate = 0.6;
    speechSynthesis.speak(u);
  }

  /* ---------- SHOW WORD ---------- */
  function showNewWord() {
    wordDisplay.innerHTML = "";
    currentWord = words[Math.floor(Math.random() * words.length)];

    for (const letter of currentWord) {
      const span = document.createElement("span");
      span.textContent = letter.toUpperCase();
      span.className = "letter";
      span.onclick = () => playLetter(letter);
      wordDisplay.appendChild(span);
    }

    slider.min = 0;
    slider.max = currentWord.length;
    slider.value = 0;
  }

  /* ---------- SLIDER (VISUAL ONLY) ---------- */
  slider.addEventListener("input", () => {
    const letters = document.querySelectorAll(".letter");
    const progress = Number(slider.value);

    letters.forEach((l, i) => {
      l.style.backgroundColor = i < progress ? "#ffe599" : "";
    });
  });

  /* ---------- BLEND WORD ---------- */
  blendButton.addEventListener("click", () => {
    if (!currentWord) return;

    const letters = document.querySelectorAll(".letter");
    let i = 0;

    const timer = setInterval(() => {
      letters.forEach(l => (l.style.backgroundColor = ""));
      if (letters[i]) {
        letters[i].style.backgroundColor = "#ffd966";
        i++;
      } else {
        clearInterval(timer);
        setTimeout(speakWord, 200);
      }
    }, 350);
  });

  /* ---------- EVENTS ---------- */
  newWordButton.addEventListener("click", showNewWord);

  /* ---------- INIT ---------- */
  wordDisplay.innerHTML = `<p>Click "New Word" to start!</p>`;
});

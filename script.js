document.addEventListener("DOMContentLoaded", () => {
  const wordDisplay = document.getElementById("word-display");
  const newWordBtn = document.getElementById("new-word-button");
  const blendBtn = document.getElementById("blend-word-button");
  const slider = document.getElementById("blend-slider");

  if (!wordDisplay || !newWordBtn || !blendBtn || !slider) {
    alert("Missing HTML elements. Check IDs.");
    return;
  }

  /* =========================
     WORD BANK
     ========================= */
  const wordGroups = {
    a: ["cat","bat","mat","rat","man","pan"],
    e: ["bed","red","ten","pen","met","jet"],
    i: ["pin","sit","lit","kit","dig","pig"],
    o: ["dog","log","hop","cot","pot","mop"],
    u: ["sun","cup","mud","run","hug","bug"]
  };

  function getRandomWord() {
    const vowels = Object.keys(wordGroups);
    const v = vowels[Math.floor(Math.random() * vowels.length)];
    const list = wordGroups[v];
    return list[Math.floor(Math.random() * list.length)];
  }

  let currentWord = "";

  /* =========================
     AUDIO
     ========================= */
  function playLetter(letter) {
    const audio = new Audio(`sounds_clean/${letter}.mp3`);
    audio.play().catch(() => {});
  }

  /* =========================
     DISPLAY WORD
     ========================= */
  function showNewWord() {
    wordDisplay.innerHTML = "";
    currentWord = getRandomWord();

    [...currentWord].forEach(letter => {
      const span = document.createElement("span");
      span.textContent = letter.toUpperCase();
      span.className = "letter";
      span.addEventListener("click", () => playLetter(letter));
      wordDisplay.appendChild(span);
    });

    slider.min = 0;
    slider.max = currentWord.length;
    slider.value = 0;
  }

  /* =========================
     SLIDER BLENDING (VISUAL)
     ========================= */
  slider.addEventListener("input", () => {
    const letters = document.querySelectorAll(".letter");
    const pos = Number(slider.value);

    letters.forEach((l, i) => {
      l.style.backgroundColor = i < pos ? "#ffe599" : "";
    });
  });

  /* =========================
     BLEND FULL WORD
     ========================= */
  blendBtn.addEventListener("click", () => {
    const letters = document.querySelectorAll(".letter");
    let i = 0;

    const interval = setInterval(() => {
      letters.forEach(l => (l.style.backgroundColor = ""));
      if (letters[i]) {
        letters[i].style.backgroundColor = "#ffd966";
        playLetter(letters[i].textContent.toLowerCase());
        i++;
      } else {
        clearInterval(interval);
      }
    }, 350);
  });

  /* =========================
     EVENTS
     ========================= */
  newWordBtn.addEventListener("click", showNewWord);
});

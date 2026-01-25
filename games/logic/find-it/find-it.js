const words = [
  "cat", "dog", "sun", "map", "pan", "bug", "cup", "hat", "fan", "pig", "web", "jam", "mix", "rug", "bed"
];

const shapeEl = document.getElementById("shape");
const bankEl = document.getElementById("bank");
const statusEl = document.getElementById("status");
const newWordBtn = document.getElementById("new-word");
const clearBtn = document.getElementById("clear");
const hearWordBtn = document.getElementById("hear-word");
const hearLettersBtn = document.getElementById("hear-letters");
const shapeButtons = Array.from(document.querySelectorAll(".shape-btn"));
const slotsContainer = document.getElementById("slots");
const burstLayer = document.getElementById("burst-layer");

let slots = [];
let currentWord = "cat";
let celebrating = false;

function speak(text) {
  if (!text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1.05;
    speechSynthesis.speak(u);
  } catch (_) {}
}

function playLetter(letter) {
  if (!letter) return;
  const a = new Audio(`../../../assets/sounds/${letter.toLowerCase()}.mp3`);
  a.play().catch(() => speak(letter));
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnBurst() {
  if (!burstLayer) return;
  burstLayer.innerHTML = "";

  const addParticle = (cls) => {
    const p = document.createElement("div");
    p.className = `burst ${cls}`;
    const dx = randomRange(-70, 70);
    const dy = randomRange(-60, 60);
    p.style.setProperty("--dx", `${dx}px`);
    p.style.setProperty("--dy", `${dy}px`);
    p.style.left = `${50 + randomRange(-10, 10)}%`;
    p.style.top = `${50 + randomRange(-15, 15)}%`;
    p.style.animationDuration = `${randomRange(0.7, 1.1)}s`;
    p.style.animationDelay = `${randomRange(0, 0.12)}s`;
    burstLayer.appendChild(p);
  };

  for (let i = 0; i < 8; i++) addParticle("star");
  for (let i = 0; i < 10; i++) addParticle("sparkle");

  setTimeout(() => {
    burstLayer.innerHTML = "";
  }, 1200);
}

function randomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function renderSlots(count) {
  slotsContainer.innerHTML = "";
  slots = [];
  for (let i = 0; i < count; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.pos = String(i);
    slot.textContent = "?";
    slot.addEventListener("dragover", (e) => e.preventDefault());
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      const letter = (e.dataTransfer.getData("text/plain") || "").toLowerCase();
      if (!letter) return;
      slot.textContent = letter.toUpperCase();
      slot.classList.add("filled");
      playLetter(letter);
      checkWord();
    });
    slot.addEventListener("click", () => {
      const pos = Number(slot.dataset.pos || 0);
      if (slot.textContent === "?") {
        const hint = currentWord[pos];
        if (hint) playLetter(hint);
      } else {
        slot.textContent = "?";
        slot.classList.remove("filled", "correct", "wrong");
      }
    });
    slotsContainer.appendChild(slot);
    slots.push(slot);
  }
}

function buildBank(word) {
  bankEl.innerHTML = "";
  const letters = word.split("");
  const alpha = "abcdefghijklmnopqrstuvwxyz";
  while (letters.length < Math.max(5, word.length + 2)) {
    const l = alpha[Math.floor(Math.random() * alpha.length)];
    if (!letters.includes(l)) letters.push(l);
  }
  const shuffled = letters.sort(() => Math.random() - 0.5);
  shuffled.forEach((ch) => {
    const btn = document.createElement("button");
    btn.className = "tile";
    btn.draggable = true;
    btn.textContent = ch.toUpperCase();
    btn.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", ch);
      playLetter(ch);
    });
    btn.addEventListener("click", () => {
      playLetter(ch);
      dropLetter(ch);
    });
    bankEl.appendChild(btn);
  });
}

function clearSlots() {
  slots.forEach((s) => {
    s.textContent = "?";
    s.classList.remove("filled", "correct", "wrong");
  });
}

function dropLetter(letter, pos = null) {
  const targetSlot = pos !== null ? slots[pos] : slots.find((s) => s.textContent === "?");
  if (!targetSlot) return;
  targetSlot.textContent = letter.toUpperCase();
  targetSlot.classList.add("filled");
  playLetter(letter);
  checkWord();
}

function checkWord() {
  if (celebrating) return;
  const built = slots.map((s) => (s.textContent || "").toLowerCase()).join("");
  if (built.includes("?")) return;
  if (built === currentWord) {
    celebrating = true;
    slots.forEach((s) => s.classList.add("correct"));
    statusEl.textContent = "Great! You built " + currentWord.toUpperCase() + "!";
    speak(currentWord);
    shapeEl.classList.add("celebrate");
    spawnBurst();
    setTimeout(() => {
      shapeEl.classList.remove("celebrate");
      celebrating = false;
      loadWord(randomWord());
    }, 1400);
  } else {
    slots.forEach((s) => s.classList.add("wrong"));
    statusEl.textContent = "Not quite. Try swapping the blocks.";
    setTimeout(() => slots.forEach((s) => s.classList.remove("wrong")), 600);
  }
}

function loadWord(word) {
  celebrating = false;
  shapeEl.classList.remove("celebrate");
  if (burstLayer) burstLayer.innerHTML = "";
  currentWord = word;
  statusEl.textContent = "Drag letters into the shape slots.";
  renderSlots(word.length);
  buildBank(word);
}

shapeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    shapeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const shape = btn.dataset.shape;
    shapeEl.dataset.shape = shape;
  });
});

newWordBtn.addEventListener("click", () => loadWord(randomWord()));
clearBtn.addEventListener("click", clearSlots);
hearWordBtn.addEventListener("click", () => speak(currentWord));
hearLettersBtn.addEventListener("click", () => currentWord.split("").forEach((l, i) => setTimeout(() => playLetter(l), i * 450)));

loadWord(currentWord);


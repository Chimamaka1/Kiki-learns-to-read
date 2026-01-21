/* =========================
   MEMORY GAME - CARD MATCHING
========================= */

// objects + colours
const items = [
  { icon: "🍎", label: "apple" },
  { icon: "🚗", label: "car" },
  { icon: "⭐", label: "star" },
  { icon: "🐶", label: "dog" },
  { icon: "🌸", label: "flower" },
  { icon: "⚽", label: "ball" },
  { icon: "🏠", label: "house" },
  { icon: "🐱", label: "cat" }
];

const gameBoard = document.getElementById("sequence");
const startBtn = document.getElementById("start-memory");
const message = document.getElementById("message");

let cards = [];
let flipped = [];
let matched = 0;
let totalPairs = 0;
let gameActive = false;

/* ---------- HELPERS ---------- */

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function createCard(item, index) {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.dataset.index = index;
  card.dataset.icon = item.icon;
  card.dataset.label = item.label;
  card.innerHTML = '<div class="card-inner"><div class="card-front">?</div><div class="card-back"></div></div>';
  
  card.onclick = () => flipCard(card, item);
  return card;
}

function flipCard(cardEl, item) {
  if (!gameActive || cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) {
    return;
  }

  cardEl.classList.add("flipped");
  cardEl.querySelector(".card-back").textContent = item.icon;
  flipped.push({ cardEl, item });

  // Play flip sound
  playFlipSound();

  if (flipped.length === 2) {
    gameActive = false;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flipped;

  if (first.item.icon === second.item.icon) {
    // Match found!
    playMatchSound();
    first.cardEl.classList.add("matched");
    second.cardEl.classList.add("matched");
    matched++;

    if (matched === totalPairs) {
      setTimeout(() => {
        message.textContent = "🎉 You won! Great memory!";
        gameActive = false;
      }, 500);
    }
    flipped = [];
    gameActive = true;
  } else {
    // No match
    setTimeout(() => {
      first.cardEl.classList.remove("flipped");
      second.cardEl.classList.remove("flipped");
      first.cardEl.querySelector(".card-back").textContent = "";
      second.cardEl.querySelector(".card-back").textContent = "";
      flipped = [];
      gameActive = true;
    }, 1000);
  }
}

function playFlipSound() {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
    audio.play().catch(() => {});
  } catch (e) {
    // Silent fail
  }
}

function playMatchSound() {
  try {
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance("Good!"));
  } catch (e) {
    // Silent fail
  }
}

/* ---------- GAME FLOW ---------- */

startBtn.onclick = startGame;

function startGame() {
  message.textContent = "Find matching pairs!";
  gameBoard.innerHTML = "";
  cards = [];
  flipped = [];
  matched = 0;
  gameActive = true;

  // Create pairs
  const selectedItems = shuffle([...items]).slice(0, 4); // 4 pairs = 8 cards
  totalPairs = selectedItems.length;
  const cardPairs = [...selectedItems, ...selectedItems];
  const shuffledCards = shuffle(cardPairs);

  // Render cards
  shuffledCards.forEach((item, index) => {
    gameBoard.appendChild(createCard(item, index));
  });
}


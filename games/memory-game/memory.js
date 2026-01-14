/* =========================
   MEMORY GAME
========================= */

// objects + colours
const items = [
  { icon: "🍎", color: "red" },
  { icon: "🚗", color: "blue" },
  { icon: "⭐", color: "gold" },
  { icon: "🐶", color: "brown" },
  { icon: "🌸", color: "pink" },
  { icon: "⚽", color: "green" }
];

const sequenceBox = document.getElementById("sequence");
const choicesBox = document.getElementById("choices");
const startBtn = document.getElementById("start-memory");
const message = document.getElementById("message");

let sequence = [];
let userInput = [];

/* ---------- HELPERS ---------- */

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function createTile(item, clickHandler) {
  const div = document.createElement("div");
  div.className = "tile";
  div.textContent = item.icon;
  div.style.background = item.color;
  div.onclick = () => clickHandler(item);
  return div;
}

/* ---------- GAME FLOW ---------- */

startBtn.onclick = startGame;

function startGame() {
  message.textContent = "";
  sequenceBox.innerHTML = "";
  choicesBox.innerHTML = "";
  userInput = [];

  sequence = shuffle([...items]).slice(0, 3);

  // show sequence
  sequence.forEach(item => {
    sequenceBox.appendChild(createTile(item, () => {}));
  });

  // hide after 3 seconds
  setTimeout(() => {
    sequenceBox.innerHTML = "";
    showChoices();
  }, 3000);
}

function showChoices() {
  shuffle(sequence).forEach(item => {
    choicesBox.appendChild(
      createTile(item, handleChoice)
    );
  });
}

function handleChoice(item) {
  userInput.push(item);

  if (userInput.length === sequence.length) {
    checkAnswer();
  }
}

function checkAnswer() {
  const correct = userInput.every(
    (item, i) => item.icon === sequence[i].icon
  );

  message.textContent = correct
    ? "⭐ Amazing memory!"
    : "😊 Good try! Let's try again.";

  setTimeout(startGame, 2000);
}


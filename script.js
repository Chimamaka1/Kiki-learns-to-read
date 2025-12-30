const words = [
  "cat","bat","hat","mat","rat",
  "dog","dig","log","hog",
  "pen","ten","hen","men",
  "pig","wig","big","fig",
  "sun","run","fun","bun"
];

const wordDisplay = document.getElementById("word-display");
const slider = document.getElementById("blend-slider");
const newWordBtn = document.getElementById("new-word-button");
const blendBtn = document.getElementById("blend-word-button");

let currentWord = "";
let letterElements = [];

function speak(text, rate = 0.6) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  speechSynthesis.speak(u);
}

function showWord(word) {
  wordDisplay.innerHTML = "";
  letterElements = [];

  [...word].forEach(letter => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = letter;
    span.onclick = () => speak(letter);
    wordDisplay.appendChild(span);
    letterElements.push(span);
  });

  slider.max = letterElements.length;
  slider.value = 0;
}

newWordBtn.onclick = () => {
  currentWord = words[Math.floor(Math.random() * words.length)];
  showWord(currentWord);
};

slider.oninput = () => {
  const index = Number(slider.value);

  letterElements.forEach(el => el.classList.remove("active"));

  if (index > 0 && index <= letterElements.length) {
    const letter = currentWord[index - 1];
    letterElements[index - 1].classList.add("active");
    speak(letter);
  }
};

blendBtn.onclick = async () => {
  slider.value = 0;

  for (let i = 0; i < currentWord.length; i++) {
    slider.value = i + 1;
    letterElements.forEach(el => el.classList.remove("active"));
    letterElements[i].classList.add("active");
    speak(currentWord[i]);
    await new Promise(r => setTimeout(r, 700)); // slow & smooth
  }

  await new Promise(r => setTimeout(r, 400));
  speak(currentWord, 0.7); // full word
};

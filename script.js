const display = document.getElementById("word-display");
const slider = document.getElementById("slider");
const newBtn = document.getElementById("new");
const blendBtn = document.getElementById("blend");

const words = ["cat","dog","sun","hat","pin","log","bat","cup"];

let letters = [];
let word = "";

function playSound(letter) {
  const audio = new Audio(`sounds_clean/${letter}.m4a`);
  audio.currentTime = 0;
  audio.play().catch(()=>{});
}

function render(w) {
  display.innerHTML = "";
  letters = [];

  [...w].forEach(l => {
    const s = document.createElement("div");
    s.className = "letter";
    s.textContent = l;
    s.onclick = () => playSound(l);
    display.appendChild(s);
    letters.push(s);
  });

  slider.max = letters.length;
  slider.value = 0;
}

newBtn.onclick = () => {
  word = words[Math.floor(Math.random()*words.length)];
  render(word);
};

slider.oninput = () => {
  letters.forEach(l => l.classList.remove("active"));
  const i = slider.value - 1;
  if (letters[i]) {
    letters[i].classList.add("active");
    playSound(letters[i].textContent);
  }
};

blendBtn.onclick = async () => {
  for (let i=0;i<letters.length;i++){
    letters.forEach(l=>l.classList.remove("active"));
    letters[i].classList.add("active");
    playSound(letters[i].textContent);
    await new Promise(r=>setTimeout(r,600));
  }
};

newBtn.click();

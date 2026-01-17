// Flags & Countries Quiz
let flagScore = 0;
let flagStreak = 0;
let currentFlag = null;

const flags = [
  { flag: '🇺🇸', code: 'us', country: 'United States' },
  { flag: '🇨🇦', code: 'ca', country: 'Canada' },
  { flag: '🇬🇧', code: 'gb', country: 'United Kingdom' },
  { flag: '🇫🇷', code: 'fr', country: 'France' },
  { flag: '🇩🇪', code: 'de', country: 'Germany' },
  { flag: '🇮🇹', code: 'it', country: 'Italy' },
  { flag: '🇪🇸', code: 'es', country: 'Spain' },
  { flag: '🇧🇷', code: 'br', country: 'Brazil' },
  { flag: '🇲🇽', code: 'mx', country: 'Mexico' },
  { flag: '🇯🇵', code: 'jp', country: 'Japan' },
  { flag: '🇨🇳', code: 'cn', country: 'China' },
  { flag: '🇰🇷', code: 'kr', country: 'South Korea' },
  { flag: '🇮🇳', code: 'in', country: 'India' },
  { flag: '🇦🇺', code: 'au', country: 'Australia' },
  { flag: '🇿🇦', code: 'za', country: 'South Africa' },
  { flag: '🇳🇬', code: 'ng', country: 'Nigeria' },
  { flag: '🇪🇬', code: 'eg', country: 'Egypt' },
  { flag: '🇸🇦', code: 'sa', country: 'Saudi Arabia' },
  { flag: '🇦🇷', code: 'ar', country: 'Argentina' },
  { flag: '🇨🇱', code: 'cl', country: 'Chile' },
  { flag: '🇵🇪', code: 'pe', country: 'Peru' },
  { flag: '🇳🇿', code: 'nz', country: 'New Zealand' },
  { flag: '🇸🇬', code: 'sg', country: 'Singapore' },
  { flag: '🇹🇭', code: 'th', country: 'Thailand' },
  { flag: '🇵🇭', code: 'ph', country: 'Philippines' },
  { flag: '🇹🇷', code: 'tr', country: 'Turkey' },
  { flag: '🇸🇪', code: 'se', country: 'Sweden' },
  { flag: '🇳🇴', code: 'no', country: 'Norway' },
  { flag: '🇩🇰', code: 'dk', country: 'Denmark' },
  { flag: '🇵🇱', code: 'pl', country: 'Poland' }
];

// Local speak helper (no dependency on global script)
if (typeof speakText !== 'function') {
  function speakText(text) {
    try {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(String(text)));
    } catch (e) {
      console.warn('Speech synthesis unavailable:', e);
    }
  }
}

function goBack() {
  window.history.back();
}

function pickRandomFlag() {
  const index = Math.floor(Math.random() * flags.length);
  return flags[index];
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function setProgress() {
  const scoreEl = document.getElementById('flag-score');
  const streakEl = document.getElementById('flag-streak');
  if (scoreEl) scoreEl.textContent = flagScore;
  if (streakEl) streakEl.textContent = flagStreak;
}

function renderChoices(correctCountry) {
  const choicesEl = document.getElementById('choices');
  if (!choicesEl) return;
  choicesEl.innerHTML = '';

  const pool = shuffle(flags)
    .filter(item => item.country !== correctCountry)
    .slice(0, 3)
    .map(item => item.country);
  pool.push(correctCountry);
  const options = shuffle(pool);

  options.forEach(country => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = country;
    btn.onclick = () => checkAnswer(btn, country, correctCountry);
    choicesEl.appendChild(btn);
  });
}

function renderFlag(flag) {
  const flagEl = document.getElementById('flag-display');
  if (flagEl) {
    flagEl.innerHTML = '';
    flagEl.setAttribute('aria-label', flag.country);

    const img = document.createElement('img');
    img.src = `https://flagcdn.com/w160/${flag.code}.png`;
    img.alt = `Flag of ${flag.country}`;
    img.loading = 'lazy';
    img.onerror = () => {
      img.remove();
      const fallback = document.createElement('div');
      fallback.className = 'flag-fallback';
      fallback.textContent = flag.flag || flag.country;
      flagEl.appendChild(fallback);
    };

    flagEl.appendChild(img);
  }
  currentFlag = flag;
  renderChoices(flag.country);
  speakText(flag.country);
}

function nextFlag() {
  const flag = pickRandomFlag();
  renderFlag(flag);
}

function checkAnswer(btn, selected, correct) {
  const buttons = document.querySelectorAll('.choice');
  buttons.forEach(b => b.disabled = true);

  if (selected === correct) {
    btn.classList.add('correct');
    flagScore += 10;
    flagStreak += 1;
    speakText(`Correct! ${correct}`);
  } else {
    btn.classList.add('wrong');
    flagStreak = 0;
    const correctBtn = Array.from(buttons).find(b => b.textContent === correct);
    if (correctBtn) correctBtn.classList.add('correct');
    speakText(`Not quite. That was ${correct}.`);
  }

  setProgress();
  setTimeout(() => {
    buttons.forEach(b => {
      b.disabled = false;
      b.classList.remove('correct', 'wrong');
    });
    nextFlag();
  }, 1200);
}

function initFlagQuiz() {
  const hearBtn = document.getElementById('hear-flag');
  const nextBtn = document.getElementById('next-flag');

  if (hearBtn) hearBtn.onclick = () => { if (currentFlag) speakText(currentFlag.country); };
  if (nextBtn) nextBtn.onclick = nextFlag;

  nextFlag();
  setProgress();
}

document.addEventListener('DOMContentLoaded', initFlagQuiz);

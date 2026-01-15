/* ==============================
   MISSING LETTER GAME
================================ */

let audioReady = false;

// Missing Letter Game Elements
const missingWordDisplay = document.getElementById("missing-word-display");
const hearWordBtn = document.getElementById("hear-word-button");
const newMissingWordBtn = document.getElementById("new-missing-word-button");
const letterChoicesDiv = document.getElementById("letter-choices");

// Missing Letter Game Variables
let currentMissingWord = "";
let missingPosition = 0;
let correctLetter = "";
let gameAttempts = 0;

// Progress Tracking Variables
let progressData = {
  correct: 0,
  incorrect: 0,
  totalAttempts: 0,
  recentWords: [],
  sessionStart: new Date().toISOString()
};

// Three letter words for the missing letter game
const missingLetterWords = [
  "cat", "bat", "hat", "mat", "rat", "sat", "fat", "pat",
  "dog", "log", "fog", "hog", "bog", "cog",
  "bag", "tag", "rag", "lag", "wag", "sag",
  "pen", "hen", "men", "ten", "den", "zen",
  "cup", "pup", "sup", "tup",
  "bug", "hug", "jug", "mug", "rug", "tug",
  "run", "sun", "fun", "gun", "bun", "nun",
  "big", "dig", "fig", "pig", "wig", "rig",
  "top", "hop", "mop", "pop", "cop", "sop",
  "red", "bed", "fed", "led", "wed", "ted"
];

/* ==============================
   AUDIO HELPERS
================================ */

// Get API credentials from config
const elevenLabsApiKey = window.config?.elevenLabs?.apiKey || '';
const voiceId = window.config?.elevenLabs?.voiceId || '';

function playLetter(letter) {
  if (!audioReady) return;
  const a = new Audio(`../../assets/sounds/${letter}.mp3`);
  a.currentTime = 0;
  a.play().catch(() => {});
}

async function speakWord(word) {
  if (!audioReady) return;
  
  // Check if ElevenLabs credentials are available
  if (!elevenLabsApiKey || !voiceId) {
    console.warn('ElevenLabs credentials not configured, using fallback speech synthesis');
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(word));
    return;
  }
  
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey
      },
      body: JSON.stringify({
        text: word,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch(() => {});
      
      // Clean up the object URL after playback
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } else {
      // Fallback to speech synthesis if ElevenLabs fails
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(word));
    }
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    // Fallback to speech synthesis
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(word));
  }
}

/* ==============================
   PROGRESS TRACKING
================================ */

// Load saved progress from localStorage
function loadProgress() {
  const saved = localStorage.getItem('missingLetterProgress');
  if (saved) {
    try {
      progressData = { ...progressData, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Could not load saved progress:', e);
    }
  }
  updateProgressDisplay();
}

// Save progress to localStorage
function saveProgress() {
  try {
    localStorage.setItem('missingLetterProgress', JSON.stringify(progressData));
  } catch (e) {
    console.warn('Could not save progress:', e);
  }
}

// Update progress display
function updateProgressDisplay() {
  const correctCount = document.getElementById('correct-count');
  const incorrectCount = document.getElementById('incorrect-count');
  const accuracyPercent = document.getElementById('accuracy-percent');
  
  if (correctCount) correctCount.textContent = progressData.correct;
  if (incorrectCount) incorrectCount.textContent = progressData.incorrect;
  
  const accuracy = progressData.totalAttempts > 0 
    ? Math.round((progressData.correct / progressData.totalAttempts) * 100) 
    : 0;
  if (accuracyPercent) accuracyPercent.textContent = accuracy + '%';
}

// Record a game attempt
function recordAttempt(word, wasCorrect, chosenLetter, correctLetter) {
  progressData.totalAttempts++;
  if (wasCorrect) {
    progressData.correct++;
  } else {
    progressData.incorrect++;
  }
  
  // Add to recent words (keep last 20)
  const attempt = {
    word: word,
    correct: wasCorrect,
    chosenLetter: chosenLetter,
    correctLetter: correctLetter,
    timestamp: new Date().toISOString()
  };
  
  progressData.recentWords.unshift(attempt);
  if (progressData.recentWords.length > 20) {
    progressData.recentWords = progressData.recentWords.slice(0, 20);
  }
  
  updateProgressDisplay();
  saveProgress();
}

/* ==============================
   GAME LOGIC
================================ */

// Generate random letters for choices
function generateLetterChoices(correctLetter) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const choices = [correctLetter];
  
  while (choices.length < 4) {
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!choices.includes(randomLetter)) {
      choices.push(randomLetter);
    }
  }
  
  // Shuffle the choices
  return choices.sort(() => Math.random() - 0.5);
}

// Render the word with missing letter
function renderMissingWord(word, position) {
  missingWordDisplay.innerHTML = "";
  
  [...word].forEach((letter, index) => {
    const tile = document.createElement("div");
    tile.className = "missing-letter";
    
    if (index === position) {
      tile.classList.add("blank");
      tile.textContent = "";
    } else {
      tile.textContent = letter;
      // Make the visible letters clickable to hear their sounds
      tile.style.cursor = "pointer";
      tile.onclick = () => playLetter(letter);
      tile.title = "Click to hear the sound of '" + letter + "'";
    }
    
    missingWordDisplay.appendChild(tile);
  });
}

// Render letter choices
function renderLetterChoices(choices) {
  letterChoicesDiv.innerHTML = "";
  
  choices.forEach(letter => {
    const choiceBtn = document.createElement("div");
    choiceBtn.className = "choice-letter";
    choiceBtn.textContent = letter;
    choiceBtn.onclick = () => handleLetterChoice(letter, choiceBtn);
    letterChoicesDiv.appendChild(choiceBtn);
  });
}

// Handle letter choice click
async function handleLetterChoice(chosenLetter, choiceElement) {
  gameAttempts++;
  
  if (chosenLetter === correctLetter) {
    // Correct choice
    choiceElement.classList.add("correct");
    
    // Record correct attempt
    recordAttempt(currentMissingWord, true, chosenLetter, correctLetter);
    
    // Fill in the missing letter
    const blankTile = document.querySelector(".missing-letter.blank");
    if (blankTile) {
      blankTile.textContent = correctLetter;
      blankTile.classList.remove("blank");
      blankTile.classList.add("filled");
      blankTile.style.removeProperty("position");
      // Make the filled letter clickable to hear its sound
      blankTile.style.cursor = "pointer";
      blankTile.onclick = () => playLetter(correctLetter);
      blankTile.title = "Click to hear the sound of '" + correctLetter + "'";
    }
    
    // Speak "Great!" and then the complete word
    await speakWord("Great!");
    setTimeout(() => speakWord(currentMissingWord), 1000);
    
    // Disable all choice buttons
    document.querySelectorAll(".choice-letter").forEach(btn => {
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.7";
    });
    
    // Auto-generate new word after delay
    setTimeout(() => {
      newMissingWord();
    }, 3000);
    
  } else {
    // Incorrect choice
    choiceElement.classList.add("incorrect");
    
    // Record incorrect attempt
    recordAttempt(currentMissingWord, false, chosenLetter, correctLetter);
    
    // Speak "Incorrect" and then the correct complete word to help the user learn
    await speakWord("Incorrect");
    setTimeout(() => speakWord(currentMissingWord), 1000);
    
    // Remove incorrect styling after animation
    setTimeout(() => {
      choiceElement.classList.remove("incorrect");
    }, 500);
  }
}

// Start new missing letter word
function newMissingWord() {
  // Reset game state
  gameAttempts = 0;
  
  // Choose random word and position
  currentMissingWord = missingLetterWords[Math.floor(Math.random() * missingLetterWords.length)];
  missingPosition = Math.floor(Math.random() * currentMissingWord.length);
  correctLetter = currentMissingWord[missingPosition];
  
  // Generate letter choices
  const choices = generateLetterChoices(correctLetter);
  
  // Render the game
  renderMissingWord(currentMissingWord, missingPosition);
  renderLetterChoices(choices);
  
  // Speak the word automatically
  setTimeout(() => speakWord(currentMissingWord), 500);
}

/* ==============================
   PROGRESS MODAL FUNCTIONS
================================ */

function showDetailedProgress() {
  const modal = document.getElementById('progress-modal');
  if (!modal) return;
  
  // Update modal content
  document.getElementById('total-attempts').textContent = progressData.totalAttempts;
  document.getElementById('modal-correct').textContent = progressData.correct;
  document.getElementById('modal-incorrect').textContent = progressData.incorrect;
  
  const accuracy = progressData.totalAttempts > 0 
    ? Math.round((progressData.correct / progressData.totalAttempts) * 100) 
    : 0;
  document.getElementById('modal-accuracy').textContent = accuracy + '%';
  
  // Update recent words
  const recentWordsDiv = document.getElementById('recent-words');
  if (recentWordsDiv) {
    if (progressData.recentWords.length === 0) {
      recentWordsDiv.innerHTML = '<p>No attempts yet. Start playing to see your progress!</p>';
    } else {
      recentWordsDiv.innerHTML = progressData.recentWords.map(attempt => 
        `<div class="word-attempt ${attempt.correct ? 'correct' : 'incorrect'}">
          <span><strong>${attempt.word}</strong> (chose: ${attempt.chosenLetter})</span>
          <span>${attempt.correct ? '✅' : '❌'}</span>
        </div>`
      ).join('');
    }
  }
  
  modal.style.display = 'flex';
}

function hideDetailedProgress() {
  const modal = document.getElementById('progress-modal');
  if (modal) modal.style.display = 'none';
}

function resetProgress() {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
    progressData = {
      correct: 0,
      incorrect: 0,
      totalAttempts: 0,
      recentWords: [],
      sessionStart: new Date().toISOString()
    };
    updateProgressDisplay();
    saveProgress();
    alert('Progress has been reset!');
  }
}

function exportProgress() {
  const report = `Missing Letter Game Progress Report
========================================
Total Attempts: ${progressData.totalAttempts}
Correct: ${progressData.correct}
Incorrect: ${progressData.incorrect}
Accuracy: ${progressData.totalAttempts > 0 ? Math.round((progressData.correct / progressData.totalAttempts) * 100) : 0}%

Recent Words:
${progressData.recentWords.slice(0, 10).map(attempt => 
    `${attempt.word} - ${attempt.correct ? 'Correct' : 'Incorrect'} (chose: ${attempt.chosenLetter})`
  ).join('\n')}

Generated: ${new Date().toLocaleDateString()}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Learning Progress Report',
      text: report
    }).catch(() => {
      // Fallback to copy to clipboard
      copyToClipboard(report);
    });
  } else {
    copyToClipboard(report);
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Progress report copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      fallbackCopyTextToClipboard(text);
    });
  } else {
    fallbackCopyTextToClipboard(text);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    alert('Progress report copied to clipboard!');
  } catch (err) {
    alert('Could not copy progress report. Please copy manually from the details view.');
  }
  document.body.removeChild(textArea);
}

/* ==============================
   GAME INITIALIZATION
================================ */

// Event listeners for missing letter game
if (hearWordBtn) {
  hearWordBtn.onclick = () => speakWord(currentMissingWord);
}

if (newMissingWordBtn) {
  newMissingWordBtn.onclick = newMissingWord;
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
  loadProgress();
  setTimeout(() => {
    if (audioReady) {
      newMissingWord();
    }
  }, 1000);
});
// CVC Storybook
const stories = [
  {
    title: "The Big Cat",
    pages: [
      { text: "A <span class='cvc-word'>cat</span> sat on a <span class='cvc-word'>mat</span>.", emoji: "🐱" },
      { text: "The <span class='cvc-word'>cat</span> was <span class='cvc-word'>big</span>.", emoji: "🐱" },
      { text: "The <span class='cvc-word'>cat</span> had a <span class='cvc-word'>hat</span>.", emoji: "🎩🐱" },
      { text: "The <span class='cvc-word'>cat</span> sat on the <span class='cvc-word'>mat</span>.", emoji: "🐱" },
      { text: "The <span class='cvc-word'>cat</span> is happy!", emoji: "🐱😊" }
    ]
  },
  {
    title: "The Red Hen",
    pages: [
      { text: "A <span class='cvc-word'>hen</span> sat in a <span class='cvc-word'>pen</span>.", emoji: "🐔" },
      { text: "The <span class='cvc-word'>hen</span> was <span class='cvc-word'>red</span>.", emoji: "🐔" },
      { text: "The <span class='cvc-word'>hen</span> saw a <span class='cvc-word'>bug</span>.", emoji: "🐔🐛" },
      { text: "The <span class='cvc-word'>hen</span> ate the <span class='cvc-word'>bug</span>.", emoji: "🐔" },
      { text: "The <span class='cvc-word'>hen</span> was happy!", emoji: "🐔😊" }
    ]
  },
  {
    title: "The Hot Sun",
    pages: [
      { text: "The <span class='cvc-word'>sun</span> is <span class='cvc-word'>hot</span>.", emoji: "☀️" },
      { text: "A <span class='cvc-word'>man</span> sat in the <span class='cvc-word'>sun</span>.", emoji: "👨☀️" },
      { text: "The <span class='cvc-word'>man</span> got a <span class='cvc-word'>hat</span>.", emoji: "👨🎩" },
      { text: "The <span class='cvc-word'>hat</span> is on his head.", emoji: "👨🎩" },
      { text: "Now the <span class='cvc-word'>man</span> is not <span class='cvc-word'>hot</span>!", emoji: "👨😊" }
    ]
  },
  {
    title: "The Wet Dog",
    pages: [
      { text: "A <span class='cvc-word'>dog</span> ran in the rain.", emoji: "🐕🌧️" },
      { text: "The <span class='cvc-word'>dog</span> got <span class='cvc-word'>wet</span>.", emoji: "🐕💦" },
      { text: "The <span class='cvc-word'>dog</span> ran to a <span class='cvc-word'>tub</span>.", emoji: "🐕🛁" },
      { text: "The <span class='cvc-word'>dog</span> sat in the <span class='cvc-word'>tub</span>.", emoji: "🐕🛁" },
      { text: "Now the <span class='cvc-word'>dog</span> is dry!", emoji: "🐕✨" }
    ]
  },
  {
    title: "The Little Bug",
    pages: [
      { text: "A <span class='cvc-word'>bug</span> sat on a <span class='cvc-word'>rug</span>.", emoji: "🐛" },
      { text: "The <span class='cvc-word'>bug</span> was <span class='cvc-word'>red</span>.", emoji: "🐛" },
      { text: "The <span class='cvc-word'>bug</span> saw a <span class='cvc-word'>cup</span>.", emoji: "🐛☕" },
      { text: "The <span class='cvc-word'>bug</span> ran to the <span class='cvc-word'>cup</span>.", emoji: "🐛☕" },
      { text: "The <span class='cvc-word'>bug</span> had a sip!", emoji: "🐛😋" }
    ]
  },
  {
    title: "The Fun Pig",
    pages: [
      { text: "A <span class='cvc-word'>pig</span> ran in the <span class='cvc-word'>mud</span>.", emoji: "🐷" },
      { text: "The <span class='cvc-word'>pig</span> had <span class='cvc-word'>fun</span>.", emoji: "🐷😊" },
      { text: "The <span class='cvc-word'>pig</span> met a <span class='cvc-word'>hen</span>.", emoji: "🐷🐔" },
      { text: "The <span class='cvc-word'>pig</span> and <span class='cvc-word'>hen</span> ran.", emoji: "🐷🐔💨" },
      { text: "They had <span class='cvc-word'>fun</span> together!", emoji: "🐷🐔❤️" }
    ]
  },
  {
    title: "Puddle Play",
    pages: [
      { text: "The <span class='cvc-word'>sun</span> set and it did <span class='cvc-word'>rain</span>.", emoji: "☀️🌧️", action: { label: "Splash the puddle", sound: "splash", speak: "Splash splash!" } },
      { text: "A <span class='cvc-word'>kid</span> got a red <span class='cvc-word'>pan</span>.", emoji: "🧒🍳", action: { label: "Tap the pan", sound: "ding", speak: "Tap the pan!" } },
      { text: "The <span class='cvc-word'>kid</span> and a <span class='cvc-word'>dog</span> run to the <span class='cvc-word'>mud</span>.", emoji: "🧒🐶", action: { label: "Jump with the dog", sound: "pop", speak: "Jump jump!" } },
      { text: "They <span class='cvc-word'>splash</span> and <span class='cvc-word'>laugh</span>.", emoji: "💦😂", action: { label: "Make a splash", sound: "splash" } }
    ]
  },
  {
    title: "Picnic Pals",
    pages: [
      { text: "A <span class='cvc-word'>cat</span> and a <span class='cvc-word'>hen</span> pack a <span class='cvc-word'>bag</span>.", emoji: "🐱🐔🎒", action: { label: "Pack the bag", sound: "zip", speak: "Pack the snacks!" } },
      { text: "They sit on a <span class='cvc-word'>mat</span> in the <span class='cvc-word'>sun</span>.", emoji: "🐱🐔☀️", action: { label: "Lay the mat", sound: "whoosh" } },
      { text: "The <span class='cvc-word'>pig</span> runs in with a <span class='cvc-word'>bun</span>.", emoji: "🐷🥯", action: { label: "Share the bun", sound: "chime" } },
      { text: "They <span class='cvc-word'>sip</span> and <span class='cvc-word'>chat</span> and have <span class='cvc-word'>fun</span>.", emoji: "🥤😊", action: { label: "Cheers!", sound: "clink" } }
    ]
  },
  {
    title: "Space Pup",
    pages: [
      { text: "A <span class='cvc-word'>pup</span> gets in a <span class='cvc-word'>pod</span>.", emoji: "🐶🚀", action: { label: "Launch!", soundFile: "../../../assets/sounds/music.mp3", speak: "3, 2, 1, launch!" } },
      { text: "The <span class='cvc-word'>pod</span> goes <span class='cvc-word'>up</span> to the <span class='cvc-word'>sun</span>.", emoji: "🚀☀️", action: { label: "Boost", sound: "whoosh" } },
      { text: "The <span class='cvc-word'>pup</span> sees a red <span class='cvc-word'>bug</span> in the <span class='cvc-word'>sky</span>.", emoji: "🐶🛸", action: { label: "Catch the bug", soundFile: "../../../assets/sounds/pop.mp3" } },
      { text: "The <span class='cvc-word'>pup</span> and <span class='cvc-word'>bug</span> say <span class='cvc-word'>hi</span>.", emoji: "🐶👋🐛", action: { label: "Wave hello", sound: "ding", speak: "Hello little bug!" } }
    ]
  }
];

let currentStory = null;
let currentPage = 0;
let currentSceneCanvas = null;

// Speech helper - always available in global scope
function speakText(text) {
  try {
    // Remove HTML tags for speech
    const cleanText = text.replace(/<[^>]*>/g, '');
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech unavailable:', e);
  }
}

// Simple SFX using Web Audio (lightweight, no assets)
let sfxContext = null;
function ensureSfxContext() {
  if (!sfxContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    sfxContext = new AudioCtx();
  }
  if (sfxContext.state === 'suspended') {
    sfxContext.resume().catch(() => {});
  }
  return sfxContext;
}

function playSfx(type = 'pop') {
  const ctx = ensureSfxContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = ['ding','chime','clink'].includes(type) ? 'sine' : 'triangle';
  const now = ctx.currentTime;
  const freqMap = {
    pop: 330,
    splash: 180,
    whoosh: 240,
    ding: 660,
    chime: 520,
    clink: 720,
    zip: 440,
    tap: 520
  };
  const base = freqMap[type] || 400;
  osc.frequency.setValueAtTime(base, now);
  osc.frequency.exponentialRampToValueAtTime(base / 2, now + 0.18);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

// Simple audio-file playback with caching
const audioCache = new Map();
function playAudioFile(src) {
  if (!src) return;
  let audio = audioCache.get(src);
  if (!audio) {
    audio = new Audio(src);
    audio.preload = 'auto';
    audioCache.set(src, audio);
  }
  // Reset to start for repeat plays
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Fail silently; keep UX smooth
  });
}

function goBack() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#reading-section';
}

// Reading Guide functionality - horizontal finger tracker
function initReadingGuide() {
  const guide = document.getElementById('reading-guide');
  const storyText = document.getElementById('story-text');
  if (!guide || !storyText) return;
  
  const finger = guide.querySelector('.guide-finger');
  let isDragging = false;
  let lastWord = null;
  
  // Find word under finger position (target wrapped words only)
  function getWordUnderFinger(fingerX) {
    const words = storyText.querySelectorAll('.sb-word, .cvc-word');
    for (let word of words) {
      const rect = word.getBoundingClientRect();
      if (fingerX >= rect.left && fingerX <= rect.right) {
        return word;
      }
    }
    return null;
  }
  
  // Position guide under story text
  function positionGuide() {
    const rect = storyText.getBoundingClientRect();
    guide.style.top = (rect.bottom + 5) + 'px';
    guide.style.left = rect.left + 'px';
    guide.style.width = rect.width + 'px';
    guide.classList.add('active');
  }
  
  positionGuide();
  window.addEventListener('resize', positionGuide);
  
  // Also reposition when page changes
  const observer = new MutationObserver(positionGuide);
  observer.observe(storyText, { childList: true, subtree: true });
  
  // Drag finger horizontally with pointer events (stable on iPad)
  const onPointerMove = (clientX) => {
    const rect = guide.getBoundingClientRect();
    // Clamp so the finger stays fully within the guide
    const half = finger.offsetWidth / 2;
    let x = clientX - rect.left;
    x = Math.max(half, Math.min(x, rect.width - half));
    finger.style.left = x + 'px';

    // Use the visual finger center for hit detection
    const fingerCenterClientX = rect.left + x;
    const word = getWordUnderFinger(fingerCenterClientX);
    if (word && word !== lastWord) {
      if (lastWord) lastWord.classList.remove('word-jump');
      word.classList.add('word-jump');
      lastWord = word;
      setTimeout(() => word.classList.remove('word-jump'), 400);
    }
  };

  finger.addEventListener('pointerdown', (e) => {
    isDragging = true;
    try { finger.setPointerCapture(e.pointerId); } catch {}
    onPointerMove(e.clientX);
    e.preventDefault();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    onPointerMove(e.clientX);
    e.preventDefault();
  }, { passive: false });

  const stopDrag = () => { isDragging = false; };
  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);
}

function displayStoryList() {
  const storyList = document.getElementById('story-list');
  storyList.innerHTML = '';

  stories.forEach((story, index) => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <h3>${story.title}</h3>
      <p>${story.pages.length} pages</p>
    `;
    card.onclick = () => openStory(index);
    storyList.appendChild(card);
  });
}

function openStory(index) {
  currentStory = stories[index];
  currentPage = 0;
  document.querySelector('.story-selector').classList.add('hidden');
  document.getElementById('story-reader').classList.remove('hidden');
  initReadingGuide(); // Initialize reading guide when story opens
  displayPage();
}

function closeStory() {
  currentStory = null;
  currentPage = 0;
  document.querySelector('.story-selector').classList.remove('hidden');
  document.getElementById('story-reader').classList.add('hidden');
}

function displayPage() {
  if (!currentStory) return;

  const page = currentStory.pages[currentPage];
  document.getElementById('story-title').textContent = currentStory.title;
  // Wrap entire page text in a sentence container for visual feedback
  document.getElementById('story-text').innerHTML = `<span class="sb-sentence">${page.text}</span>`;
  // Generate a static visual scene, triggered to animate on interaction
  const storyImage = document.getElementById('story-image');
  storyImage.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 300;
  canvas.style.cursor = 'grab';
  storyImage.appendChild(canvas);
  currentSceneCanvas = { canvas, text: page.text, emoji: page.emoji || '' };
  drawStaticScene(canvas, page.text, page.emoji || '');
  enableCanvasDragInteractivity(canvas, page.text, page.emoji || '');
  document.getElementById('page-number').textContent = `Page ${currentPage + 1} of ${currentStory.pages.length}`;

  // Page action button
  const pageAction = document.getElementById('page-action');
  pageAction.innerHTML = '';
  if (page.action) {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.textContent = page.action.label || 'Do it';
    btn.onclick = () => {
      if (page.action.soundFile) playAudioFile(page.action.soundFile);
      else if (page.action.sound) playSfx(page.action.sound);
      playSceneAnimation(currentSceneCanvas);
      if (page.action.speak) speakText(page.action.speak);
    };
    pageAction.appendChild(btn);
    pageAction.style.display = 'flex';
  } else {
    pageAction.style.display = 'none';
  }

  // Enable/disable navigation buttons
  document.getElementById('prev-page').disabled = currentPage === 0;
  document.getElementById('next-page').disabled = currentPage === currentStory.pages.length - 1;

  // After injecting content, wrap remaining plain words for interactivity
  prepareInteractiveWords();
}

function nextPage() {
  if (currentStory && currentPage < currentStory.pages.length - 1) {
    currentPage++;
    displayPage();
  }
}

function prevPage() {
  if (currentStory && currentPage > 0) {
    currentPage--;
    displayPage();
  }
}

function readPage() {
  if (currentStory) {
    const page = currentStory.pages[currentPage];
    speakText(page.text);
  }
}

function readWord() {
  speakText("Click on any colored word to hear it!");
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  displayStoryList();

  // Use event delegation for CVC word clicks (works on dynamically added content)
  const storyText = document.getElementById('story-text');
  // Click: highlight and speak the word
  storyText.addEventListener('click', (e) => {
    if (e.target.classList.contains('cvc-word') || e.target.classList.contains('sb-word')) {
      e.target.classList.add('highlighted');
      const sentence = e.target.closest('.sb-sentence');
      if (sentence) {
        sentence.classList.add('active');
        setTimeout(() => sentence.classList.remove('active'), 700);
      }
      if (currentSceneCanvas) {
        playSceneAnimation(currentSceneCanvas);
      }
      // Speak the clicked word (letters and apostrophes only)
      const spoken = (e.target.textContent || '').trim().match(/[A-Za-z']+/);
      if (spoken) {
        speakText(spoken[0]);
      }
      setTimeout(() => {
        e.target.classList.remove('highlighted');
      }, 500);
    }
  });

  // Drag-to-highlight using pointer events (mouse + touch + pen)
  enablePointerDragHighlight(storyText);

  document.getElementById('prev-page').onclick = prevPage;
  document.getElementById('next-page').onclick = nextPage;
  document.getElementById('read-page').onclick = readPage;
  document.getElementById('read-word').onclick = readWord;
  document.getElementById('close-story').onclick = closeStory;
});

// Create a simple scene image from sentence text
function generateSceneForText(text, fallbackEmoji) {
  const t = text.toLowerCase();
  const canvas = document.createElement('canvas');
  const W = 480, H = 300;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#e6f3ff');
  grad.addColorStop(1, '#fff3e6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Ground
  ctx.fillStyle = '#d9f2d9';
  ctx.fillRect(0, H - 80, W, 80);

  // Helpers
  const drawEmoji = (emoji, x, y, size = 96) => {
    ctx.font = `bold ${size}px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, x, y);
  };

  const drawMat = (x, y, w = 220, h = 40, color = '#c19a6b') => {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#8b6b3f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 8);
    ctx.fill();
    ctx.stroke();
    // stripes
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    for (let i = -w / 2 + 10; i < w / 2; i += 20) {
      ctx.beginPath();
      ctx.moveTo(x + i, y - h / 2);
      ctx.lineTo(x + i, y + h / 2);
      ctx.stroke();
    }
  };

  const drawRain = () => {
    for (let i = 0; i < 80; i++) {
      const rx = Math.random() * W;
      const ry = Math.random() * (H - 120);
      ctx.strokeStyle = 'rgba(66, 135, 245, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 0, ry + 10);
      ctx.stroke();
    }
  };

  const drawTub = (x, y) => {
    ctx.fillStyle = '#a0c4ff';
    ctx.strokeStyle = '#4a6fa5';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(x - 120, y - 40, 240, 80, 25);
    ctx.fill();
    ctx.stroke();
    // water
    ctx.fillStyle = '#80c7ff';
    ctx.fillRect(x - 110, y - 10, 220, 20);
  };

  const drawMud = (x, y) => {
    ctx.fillStyle = '#7b4f2f';
    ctx.beginPath();
    ctx.ellipse(x, y, 140, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // Scene composition based on keywords
  if (t.includes('cat')) {
    drawMat(W / 2, H - 110);
    drawEmoji('🐱', W / 2, H - 150, 110);
    if (t.includes('hat')) drawEmoji('🎩', W / 2 + 50, H - 210, 60);
  } else if (t.includes('dog')) {
    if (t.includes('tub')) {
      drawTub(W / 2, H - 110);
      drawEmoji('🐕', W / 2, H - 150, 110);
    } else if (t.includes('rain') || t.includes('wet')) {
      drawRain();
      drawEmoji('🐕', W / 2, H - 150, 110);
    } else {
      drawEmoji('🐕', W / 2, H - 150, 110);
    }
  } else if (t.includes('sun') || t.includes('hot')) {
    drawEmoji('☀️', W - 80, 60, 80);
    if (t.includes('man')) drawEmoji('👨', W / 2, H - 150, 110);
    if (t.includes('hat')) drawEmoji('🎩', W / 2 + 50, H - 210, 60);
  } else if (t.includes('hen')) {
    drawEmoji('🐔', W / 2, H - 150, 110);
    if (t.includes('bug')) drawEmoji('🐛', W / 2 + 90, H - 140, 60);
    if (t.includes('cup')) drawEmoji('☕', W / 2 - 90, H - 140, 60);
  } else if (t.includes('pig')) {
    drawMud(W / 2, H - 110);
    drawEmoji('🐷', W / 2, H - 150, 110);
  } else {
    // Fallback: show given emoji large
    if (fallbackEmoji) {
      drawEmoji(fallbackEmoji, W / 2, H - 150, 120);
    }
  }

  return canvas.toDataURL('image/png');
}

// Draw a static scene on the canvas
function drawStaticScene(canvas, text, fallbackEmoji, offsetX = 0, offsetY = 0) {
  const W = 480, H = 300;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const t = text.toLowerCase();

  // Determine character size based on text keywords
  let charScale = 1;
  if (t.includes('big') || t.includes('large')) charScale = 1.3;
  else if (t.includes('huge') || t.includes('giant')) charScale = 1.6;
  else if (t.includes('tiny') || t.includes('little') || t.includes('small')) charScale = 0.7;
  else if (t.includes('red') && t.includes('hen')) charScale = 1.1;

  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#e6f3ff');
  grad.addColorStop(1, '#fff3e6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#d9f2d9';
  ctx.fillRect(0, H - 80, W, 80);

  function drawEmoji(emojiChar, x, y, size = 96) {
    const scaledSize = size * charScale;
    ctx.font = `bold ${scaledSize}px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emojiChar, x + offsetX, y + offsetY);
  }

  function drawMat(x, y, w = 220, h = 40, color = '#c19a6b') {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#8b6b3f';
    ctx.lineWidth = 3;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    for (let i = -w / 2 + 10; i < w / 2; i += 20) {
      ctx.beginPath();
      ctx.moveTo(x + i, y - h / 2);
      ctx.lineTo(x + i, y + h / 2);
      ctx.stroke();
    }
  }

  function drawRain() {
    ctx.strokeStyle = 'rgba(66, 135, 245, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * W;
      const ry = Math.random() * (H - 120);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx, ry + 10);
      ctx.stroke();
    }
  }

  function drawTub(x, y) {
    ctx.fillStyle = '#a0c4ff';
    ctx.strokeStyle = '#4a6fa5';
    ctx.lineWidth = 4;
    ctx.fillRect(x - 120, y - 40, 240, 80);
    ctx.strokeRect(x - 120, y - 40, 240, 80);
    ctx.fillStyle = '#80c7ff';
    ctx.fillRect(x - 110, y - 10, 220, 20);
  }

  function drawMud(x, y) {
    ctx.fillStyle = '#7b4f2f';
    ctx.beginPath();
    ctx.ellipse(x, y, 140, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPen(x, y) {
    // Draw a wooden pen/enclosure with vertical slats
    const penW = 200, penH = 100;
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 4;
    
    // Draw fence border
    ctx.strokeRect(x - penW / 2, y - penH / 2, penW, penH);
    
    // Draw vertical slats
    ctx.lineWidth = 3;
    for (let i = -penW / 2 + 15; i < penW / 2; i += 20) {
      ctx.beginPath();
      ctx.moveTo(x + i, y - penH / 2);
      ctx.lineTo(x + i, y + penH / 2);
      ctx.stroke();
    }
    
    // Draw horizontal crossbars
    for (let j = -penH / 2 + 25; j < penH / 2; j += 25) {
      ctx.beginPath();
      ctx.moveTo(x - penW / 2, y + j);
      ctx.lineTo(x + penW / 2, y + j);
      ctx.stroke();
    }
  }
  if (t.includes('cat')) {
    drawMat(W / 2, H - 110);
    // Cat starts higher up (above mat) on first mention, can be dragged onto mat
    const catY = t.includes('sat on') ? H - 150 : H - 80;
    drawEmoji('🐱', W / 2, catY, 110);
    if (t.includes('hat')) {
      // Hat is offset to the right, independently draggable
      const hatY = t.includes('sat on') ? H - 200 : H - 130;
      drawEmoji('🎩', W / 2 + 50, hatY, 60);
    }
  } else if (t.includes('dog')) {
    if (t.includes('tub')) {
      drawTub(W / 2, H - 110);
      drawEmoji('🐕', W / 2, H - 150, 110);
    } else if (t.includes('rain') || t.includes('wet')) {
      drawRain();
      drawEmoji('🐕', W / 2, H - 150, 110);
    } else {
      drawEmoji('🐕', W / 2, H - 150, 110);
    }
  } else if (t.includes('sun') || t.includes('hot')) {
    drawEmoji('☀️', W - 80, 60, 80);
    if (t.includes('man')) drawEmoji('👨', W / 2, H - 150, 110);
    if (t.includes('hat')) drawEmoji('🎩', W / 2 + 50, H - 210, 60);
  } else if (t.includes('hen')) {
    if (t.includes('pen')) drawPen(W / 2, H - 120);
    drawEmoji('🐔', W / 2, H - 150, 110);
    if (t.includes('bug')) drawEmoji('🐛', W / 2 + 90, H - 140, 60);
    if (t.includes('cup')) drawEmoji('☕', W / 2 - 90, H - 140, 60);
  } else if (t.includes('pig')) {
    drawMud(W / 2, H - 110);
    drawEmoji('🐷', W / 2, H - 150, 110);
  } else {
    if (fallbackEmoji) drawEmoji(fallbackEmoji, W / 2, H - 150, 120);
  }
}

// Trigger a brief animation on the scene when user clicks/drags
function playSceneAnimation(sceneData) {
  const { canvas, text, emoji } = sceneData;
  const W = 480, H = 300;
  const t = text.toLowerCase();
  const duration = 600; // ms
  const startTime = Date.now();

  function animFrame() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Redraw static scene
    drawStaticScene(canvas, text, emoji);

    // Add bounce effect
    const ctx = canvas.getContext('2d');
    const bounce = Math.sin(progress * Math.PI * 2.5) * 20;
    const scale = 1 + Math.sin(progress * Math.PI) * 0.15;

    // Get the main subject's position based on keywords
    let mainX = W / 2, mainY = H - 150;
    let mainSize = 110;

    // Save and apply transformation
    ctx.save();
    ctx.translate(mainX + bounce * 0.5, mainY + bounce);
    ctx.scale(scale, scale);
    ctx.translate(-mainX - bounce * 0.5, -mainY - bounce);

    // Draw a pulsing glow around the main subject
    ctx.fillStyle = `rgba(255, 235, 59, ${0.4 * (1 - progress)})`;
    ctx.beginPath();
    ctx.arc(mainX, mainY, (mainSize / 2 + 20) * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Yellow highlight flash that fades
    ctx.fillStyle = `rgba(255, 235, 59, ${0.15 * Math.max(0, Math.sin(progress * Math.PI))})`;
    ctx.fillRect(0, 0, W, H);

    if (progress < 1) {
      requestAnimationFrame(animFrame);
    }
  }

  requestAnimationFrame(animFrame);
}
// Wrap plain text nodes inside #story-text into individual word spans
function prepareInteractiveWords() {
  const container = document.getElementById('story-text');
  if (!container) return;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      // Only wrap non-empty text nodes
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  const toWrap = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    // Skip if parent already a word span
    if (node.parentElement && (node.parentElement.classList.contains('sb-word') || node.parentElement.classList.contains('cvc-word'))) {
      continue;
    }
    toWrap.push(node);
  }

  toWrap.forEach(textNode => {
    const text = textNode.nodeValue;
    const frag = document.createDocumentFragment();

    // Split on word boundaries while keeping spaces/punctuation
    const parts = text.split(/(\b[\w']+\b)/);
    parts.forEach(part => {
      if (!part) return;
      if (/^\b[\w']+\b$/.test(part)) {
        const span = document.createElement('span');
        span.className = 'sb-word';
        span.textContent = part;
        frag.appendChild(span);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    });

    textNode.parentNode.replaceChild(frag, textNode);
  });
}

function enablePointerDragHighlight(container) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  const DRAG_THRESHOLD = 6; // px before switching from tap to drag

  const highlightEl = (el) => {
    if (!el) return;
    if (el.classList && (el.classList.contains('sb-word') || el.classList.contains('cvc-word'))) {
      if (!el.classList.contains('highlighted')) {
        el.classList.add('highlighted');
        const sentence = el.closest('.sb-sentence');
        if (sentence) {
          sentence.classList.add('active');
          setTimeout(() => sentence.classList.remove('active'), 700);
        }
        if (currentSceneCanvas) {
          playSceneAnimation(currentSceneCanvas);
        }
        setTimeout(() => el.classList.remove('highlighted'), 500);
      }
    }
  };

  container.addEventListener('pointerdown', (e) => {
    dragging = false; // decide based on movement
    startX = e.clientX;
    startY = e.clientY;
    if (container.setPointerCapture) {
      try { container.setPointerCapture(e.pointerId); } catch {}
    }
    // Immediate feedback on press without suppressing click
    highlightEl(e.target);
  });

  container.addEventListener('pointermove', (e) => {
    if (!dragging) {
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        dragging = true;
      } else {
        return; // treat as tap; don't prevent default so click can fire
      }
    }
    const el = document.elementFromPoint(e.clientX, e.clientY);
    highlightEl(el);
    e.preventDefault();
  });

  const stopDrag = () => { dragging = false; };
  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);
}

// Enable dragging of character/emoji on canvas
function enableCanvasDragInteractivity(canvas, text, emoji) {
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let hatOffsetX = 0;
  let hatOffsetY = 0;
  let panOffsetX = 0;
  let panOffsetY = 0;
  let zoomLevel = 1;
  // Hen variant state: cycle different colored/variant birds on click
  let henVariantIndex = 0;
  const henVariants = ['🐔', '🐓', '🐤', '🐥'];
  const centerX = canvas.width / 2;
  const t = text.toLowerCase();
  
  // Determine initial cat and hat positions
  const catInitialY = t.includes('sat on') ? canvas.height - 150 : canvas.height - 80;
  const hatInitialY = t.includes('sat on') ? canvas.height - 200 : canvas.height - 130;

  // Determine hitbox around main character (approx center of canvas)
  const hitboxRadius = 80;
  let lastX = 0;
  let lastY = 0;
  let draggingObject = null; // 'cat', 'hat', 'hen', or 'pan'

  const redrawWithOffset = () => {
    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext('2d');

    // For now, just redraw the static scene with offsets
    // We'll modify drawStaticScene to accept offsets for multiple objects
    ctx.clearRect(0, 0, W, H);
    
    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#e6f3ff');
    grad.addColorStop(1, '#fff3e6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#d9f2d9';
    ctx.fillRect(0, H - 80, W, 80);
    
    // Apply transformations for pan/zoom
    ctx.save();
    ctx.translate(panOffsetX, panOffsetY);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-panOffsetX / zoomLevel, -panOffsetY / zoomLevel);

    // For cat story with hat, draw separately to allow independent offsets
    if (t.includes('cat')) {
      // Draw mat
      const matX = W / 2, matY = H - 110, matW = 220, matH = 40;
      ctx.fillStyle = '#c19a6b';
      ctx.strokeStyle = '#8b6b3f';
      ctx.lineWidth = 3;
      ctx.fillRect(matX - matW / 2, matY - matH / 2, matW, matH);
      ctx.strokeRect(matX - matW / 2, matY - matH / 2, matW, matH);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      for (let i = -matW / 2 + 10; i < matW / 2; i += 20) {
        ctx.beginPath();
        ctx.moveTo(matX + i, matY - matH / 2);
        ctx.lineTo(matX + i, matY + matH / 2);
        ctx.stroke();
      }
      
      // Draw cat with offset
      const catY = catInitialY + dragOffsetY;
      const catX = centerX + dragOffsetX;
      const charScale = t.includes('big') ? 1.3 : 1;
      const scaledCatSize = 110 * charScale;
      ctx.font = `bold ${scaledCatSize}px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐱', catX, catY);
      
      // Draw hat with separate offset if it exists
      if (t.includes('hat')) {
        const hatX = centerX + 50 + hatOffsetX;
        const hatY = hatInitialY + hatOffsetY;
        const scaledHatSize = 60 * charScale;
        ctx.font = `bold ${scaledHatSize}px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif`;
        ctx.fillText('🎩', hatX, hatY);
      }
    } else if (t.includes('hen')) {
      // Draw pen if mentioned
      if (t.includes('pen')) {
        const penX = W / 2, penY = H - 120, penW = 200, penH = 100;
        ctx.strokeStyle = '#8b6914';
        ctx.lineWidth = 4;
        ctx.strokeRect(penX - penW / 2, penY - penH / 2, penW, penH);
        ctx.lineWidth = 3;
        for (let i = -penW / 2 + 15; i < penW / 2; i += 20) {
          ctx.beginPath();
          ctx.moveTo(penX + i, penY - penH / 2);
          ctx.lineTo(penX + i, penY + penH / 2);
          ctx.stroke();
        }
        for (let j = -penH / 2 + 25; j < penH / 2; j += 25) {
          ctx.beginPath();
          ctx.moveTo(penX - penW / 2, penY + j);
          ctx.lineTo(penX + penW / 2, penY + j);
          ctx.stroke();
        }
      }
      
      // Draw hen/chicken variant based on current selection
      const henX = centerX + dragOffsetX;
      const henY = H - 150 + dragOffsetY;
      const henEmoji = henVariants[henVariantIndex % henVariants.length];
      ctx.font = `bold 110px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(henEmoji, henX, henY);
      
      // Draw bug if mentioned
      if (t.includes('bug')) {
        ctx.font = `bold 60px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif`;
        ctx.fillText('🐛', W / 2 + 90 + dragOffsetX, H - 140 + dragOffsetY);
      }
      
      // Draw cup if mentioned
      if (t.includes('cup')) {
        ctx.font = `bold 60px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif`;
        ctx.fillText('☕', W / 2 - 90 + dragOffsetX, H - 140 + dragOffsetY);
      }
    } else {
      // Fall back to original draw for other stories
      drawStaticScene(canvas, text, emoji, dragOffsetX, dragOffsetY);
    }

    ctx.restore();
  };

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    lastX = x;
    lastY = y;

    if (t.includes('cat')) {
      // Check if pointer is on the cat
      const catDist = Math.sqrt(
        Math.pow(x - (centerX + dragOffsetX), 2) + Math.pow(y - (catInitialY + dragOffsetY), 2)
      );
      
      // Check if pointer is on the hat
      let hatDist = Infinity;
      if (t.includes('hat')) {
        hatDist = Math.sqrt(
          Math.pow(x - (centerX + 50 + hatOffsetX), 2) + Math.pow(y - (hatInitialY + hatOffsetY), 2)
        );
      }

      // Determine which object to drag (closer one wins)
      if (hatDist < catDist && hatDist < hitboxRadius) {
        draggingObject = 'hat';
      } else if (catDist < hitboxRadius) {
        draggingObject = 'cat';
      } else {
        draggingObject = 'pan';
      }
    } else if (t.includes('hen')) {
      // Check if pointer is on the hen
      const henDist = Math.sqrt(
        Math.pow(x - (centerX + dragOffsetX), 2) + Math.pow(y - (canvas.height - 150 + dragOffsetY), 2)
      );
      
      if (henDist < hitboxRadius) {
        // Cycle hen variants on click
        henVariantIndex = (henVariantIndex + 1) % henVariants.length;
        draggingObject = 'hen';
        redrawWithOffset();
      } else {
        draggingObject = 'pan';
      }
    } else {
      // For non-cat, non-hen stories, try to drag character or pan
      const distFromCenter = Math.sqrt(
        Math.pow(x - (centerX + dragOffsetX), 2) + Math.pow(y - (canvas.height - 150 + dragOffsetY), 2)
      );
      draggingObject = distFromCenter < hitboxRadius ? 'cat' : 'pan';
    }

    isDragging = true;
    if (canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch {}
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const deltaX = x - lastX;
    const deltaY = y - lastY;

    if (draggingObject === 'cat') {
      dragOffsetX += deltaX;
      dragOffsetY += deltaY;
      const maxOffset = 150;
      dragOffsetX = Math.max(-maxOffset, Math.min(maxOffset, dragOffsetX));
      dragOffsetY = Math.max(-100, Math.min(100, dragOffsetY));
    } else if (draggingObject === 'hen') {
      // Hen uses the same offset as the main character in hen scenes
      dragOffsetX += deltaX;
      dragOffsetY += deltaY;
      const maxOffset = 150;
      dragOffsetX = Math.max(-maxOffset, Math.min(maxOffset, dragOffsetX));
      dragOffsetY = Math.max(-100, Math.min(100, dragOffsetY));
    } else if (draggingObject === 'hat') {
      hatOffsetX += deltaX;
      hatOffsetY += deltaY;
      const maxOffset = 150;
      hatOffsetX = Math.max(-maxOffset, Math.min(maxOffset, hatOffsetX));
      hatOffsetY = Math.max(-100, Math.min(100, hatOffsetY));
    } else if (draggingObject === 'pan') {
      panOffsetX += deltaX;
      panOffsetY += deltaY;
      const maxPan = 100;
      panOffsetX = Math.max(-maxPan, Math.min(maxPan, panOffsetX));
      panOffsetY = Math.max(-maxPan, Math.min(maxPan, panOffsetY));
    }

    lastX = x;
    lastY = y;
    redrawWithOffset();
  });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    const newZoom = zoomLevel + direction * zoomSpeed;
    zoomLevel = Math.max(0.5, Math.min(3, newZoom));
    redrawWithOffset();
  }, { passive: false });

  // Pinch-to-zoom on touch devices
  let lastDistance = 0;
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (lastDistance > 0) {
        const zoomChange = (distance - lastDistance) * 0.002;
        const newZoom = zoomLevel + zoomChange;
        zoomLevel = Math.max(0.5, Math.min(3, newZoom));
        redrawWithOffset();
      }
      lastDistance = distance;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    lastDistance = 0;
  });

  const stopDrag = () => { isDragging = false; draggingObject = null; };
  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);
}

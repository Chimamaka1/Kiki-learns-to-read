// Cloze Sentences – Tricky Words

const elevenLabsApiKey = window.config?.elevenLabs?.apiKey || '';
const voiceId = window.config?.elevenLabs?.voiceId || '';

function speakText(text) {
  if (!elevenLabsApiKey || !voiceId) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85; u.pitch = 1.1;
    speechSynthesis.speak(u);
    return;
  }
  fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': elevenLabsApiKey },
    body: JSON.stringify({ text, model_id: 'eleven_monolingual_v1', voice_settings: { stability:0.5, similarity_boost:0.5 } })
  }).then(r => r.ok ? r.blob() : Promise.reject()).then(blob => {
    const url = URL.createObjectURL(blob); const a = new Audio(url); a.play().catch(()=>{});
    a.onended = () => URL.revokeObjectURL(url); a.onerror = () => URL.revokeObjectURL(url);
  }).catch(() => speakText(text));
}

const items = [
  { sentence: "___ cat is happy! 😺", answer: "the", options: ["the","a","to"] },
  { sentence: "I want ___ play! 🎮", answer: "to", options: ["to","too","two"] },
  { sentence: "Mom ___ I love you! ❤️", answer: "said", options: ["said","sad","say"] },
  { sentence: "We ___ best friends! 👫", answer: "are", options: ["are","or","our"] },
  { sentence: "___ puppy is cute! 🐶", answer: "my", options: ["my","me","I"] },
  { sentence: "___ can run fast! 🏃", answer: "I", options: ["I","in","is"] },
  { sentence: "Come ___ jump! 🦘", answer: "and", options: ["and","a","an"] },
  { sentence: "We have ___ cookies! 🍪", answer: "some", options: ["some","come","sum"] },
  { sentence: "___ is my toy! 🧸", answer: "here", options: ["here","hear","there"] },
  { sentence: "Look over ___! 👀", answer: "there", options: ["there","here","their"] },
  { sentence: "___ you want ice cream? 🍦", answer: "do", options: ["do","to","go"] },
  { sentence: "Let's ___ to the park! 🌳", answer: "go", options: ["go","no","to"] },
  { sentence: "This is ___ me! 🎁", answer: "for", options: ["for","four","far"] },
  { sentence: "I ___ a big smile! 😊", answer: "see", options: ["see","sea","be"] },
  { sentence: "___ at the bird! 🐦", answer: "look", options: ["look","book","lock"] },
];

let index = 0;
let reviewQueue = [];

const sentenceEl = document.getElementById('sentence');
const bankEl = document.getElementById('word-bank');
const nextBtn = document.getElementById('next');
const hearBtn = document.getElementById('hear-sentence');
const statusEl = document.getElementById('status');
const rewardEl = document.getElementById('reward');

function renderItem(item) {
  statusEl.textContent = '';
  rewardEl.classList.add('hidden');
  sentenceEl.innerHTML = '';
  bankEl.innerHTML = '';

  const spanBlank = document.createElement('span');
  spanBlank.className = 'blank';
  spanBlank.textContent = '_____';
  spanBlank.dataset.answer = item.answer;
  spanBlank.addEventListener('dragover', (e) => { e.preventDefault(); });
  spanBlank.addEventListener('drop', (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.getData('text/plain');
    checkAnswer(dropped, item);
  });

  const parts = item.sentence.split('___');
  sentenceEl.appendChild(document.createTextNode(parts[0] || ''));
  sentenceEl.appendChild(spanBlank);
  sentenceEl.appendChild(document.createTextNode(parts[1] || ''));
  
  // Wrap words for animation
  const guide = document.getElementById('reading-guide');
  if (guide) {
    const textNodes = Array.from(sentenceEl.childNodes).filter(n => n.nodeType === 3);
    textNodes.forEach(node => {
      if (node.textContent.trim()) {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(/(\S+)/g, '<span class="word-item">$1</span>');
        node.replaceWith(span);
      }
    });
  }

  // Word bank (also supports click-to-fill for touch devices)
  item.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'word ' + ('color-' + ((i % 3) + 1));
    btn.textContent = opt;
    btn.draggable = true;
    btn.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', opt);
    });
    btn.addEventListener('click', () => checkAnswer(opt, item));
    bankEl.appendChild(btn);
  });

  // Removed auto speech; sentence will only play on Hear Sentence click
  
  // Reposition reading guide
  setTimeout(() => {
    const guide = document.getElementById('reading-guide');
    if (guide) {
      const rect = sentenceEl.getBoundingClientRect();
      guide.style.top = (rect.bottom + 5) + 'px';
      guide.style.left = rect.left + 'px';
      guide.style.width = rect.width + 'px';
    }
  }, 100);
}

function checkAnswer(word, item) {
  const correct = word === item.answer;
  const buttons = Array.from(bankEl.querySelectorAll('.word'));
  buttons.forEach(b => {
    if (b.textContent === word) b.classList.add(correct ? 'correct' : 'wrong');
    setTimeout(() => b.classList.remove('correct','wrong'), 700);
  });

  if (correct) {
    // Fill blank and read full sentence
    const pieces = item.sentence.split('___');
    sentenceEl.innerHTML = `${pieces[0]}<span class=\"blank filled\">${item.answer}</span>${pieces[1] || ''}`;
    // Do not auto-speak; child can press Hear Sentence
    statusEl.textContent = '✅ Correct';
    rewardEl.classList.remove('hidden');
    // Tiny emoji burst
    const burst = document.createElement('div');
    burst.style.position = 'fixed'; burst.style.left = '20px'; burst.style.bottom = '20px';
    burst.style.fontSize = '24px'; burst.textContent = '🎉✨🌟';
    document.body.appendChild(burst);
    setTimeout(() => document.body.removeChild(burst), 800);
  } else {
    // Silent feedback; keep visuals only
    statusEl.textContent = '❌ Try again';
    reviewQueue.push(item);
  }
}

function pickNext() {
  if (reviewQueue.length > 0 && Math.random() < 0.6) {
    return reviewQueue.shift();
  }
  const item = items[index % items.length];
  index++;
  return item;
}

nextBtn.addEventListener('click', () => {
  renderItem(pickNext());
});

hearBtn.addEventListener('click', () => {
  const item = items[(index - 1 + items.length) % items.length];
  const currentSentence = sentenceEl.textContent && sentenceEl.textContent.includes('_____')
    ? item.sentence.replace('___','blank')
    : item.sentence.replace('___', item.answer);
  speakText(currentSentence);
});

// Click-to-speak for words in the sentence (including filled blank)
sentenceEl.addEventListener('click', (e) => {
  const t = e.target;
  if (!t) return;
  const isWord = t.classList && t.classList.contains('word-item');
  const isFilledBlank = t.classList && t.classList.contains('blank') && t.classList.contains('filled');
  if (isWord || isFilledBlank) {
    const match = (t.textContent || '').trim().match(/[A-Za-z']+/);
    if (match) {
      speakText(match[0]);
    }
  }
});

// Reading Guide functionality - horizontal finger tracker
function initReadingGuide() {
  const guide = document.getElementById('reading-guide');
  const sentenceEl = document.getElementById('sentence');
  if (!guide || !sentenceEl) return;
  
  const finger = guide.querySelector('.guide-finger');
  let isDragging = false;
  let lastWord = null;
  
  // Wrap sentence words in spans for individual animation
  function wrapWords() {
    const text = sentenceEl.innerHTML;
    const wrapped = text.replace(/(<[^>]+>|[^<\s]+)/g, '<span class="word-item">$1</span>');
    sentenceEl.innerHTML = wrapped;
  }
  
  // Find word under finger position
  function getWordUnderFinger(fingerX) {
    const words = sentenceEl.querySelectorAll('.word-item');
    for (let word of words) {
      const rect = word.getBoundingClientRect();
      if (fingerX >= rect.left && fingerX <= rect.right) {
        return word;
      }
    }
    return null;
  }
  
  // Position guide under sentence
  function positionGuide() {
    const rect = sentenceEl.getBoundingClientRect();
    guide.style.top = (rect.bottom + 5) + 'px';
    guide.style.left = rect.left + 'px';
    guide.style.width = rect.width + 'px';
    guide.classList.add('active');
  }
  
  positionGuide();
  window.addEventListener('resize', positionGuide);
  
  // Drag finger horizontally
  finger.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = guide.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    finger.style.left = x + 'px';
    
    // Animate word under finger
    const word = getWordUnderFinger(e.clientX);
    if (word && word !== lastWord) {
      if (lastWord) lastWord.classList.remove('word-jump');
      word.classList.add('word-jump');
      lastWord = word;
      setTimeout(() => word.classList.remove('word-jump'), 400);
    }
    
    e.preventDefault();
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Touch support
  finger.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
  }, { passive: false });
  
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const rect = guide.getBoundingClientRect();
    let x = e.touches[0].clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    finger.style.left = x + 'px';
    
    // Animate word under finger
    const word = getWordUnderFinger(e.touches[0].clientX);
    if (word && word !== lastWord) {
      if (lastWord) lastWord.classList.remove('word-jump');
      word.classList.add('word-jump');
      lastWord = word;
      setTimeout(() => word.classList.remove('word-jump'), 400);
    }
    
    e.preventDefault();
  }, { passive: false });
  
  document.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// Initialize reading guide
initReadingGuide();

// Start
renderItem(pickNext());
